# app_nube — ExamPrep

App de práctica de exámenes universitarios con integración AWS (DynamoDB + Lambda + ChatGPT).

## Stack
- **Backend:** Node.js + Express
- **Frontend:** HTML/CSS/JS vanilla
- **Base de datos:** DynamoDB (mock local incluido)
- **IA:** Lambda → OpenAI API (mock incluido en prototipo)

## Estructura del proyecto
```
app_nube/
├── server.js              # Entry point Express
├── package.json
├── data/
│   └── questions.js       # Mock data (reemplazar con DynamoDB)
├── routes/
│   ├── questions.js       # GET /api/questions/:materia
│   └── explain.js         # POST /api/explain
└── public/
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

## Instalación y arranque local

```bash
npm install
npm start
# → http://localhost:3000
```

## Despliegue en EC2 (ya configurado en CloudFormation)

El UserData del template ya ejecuta:
```bash
git clone https://github.com/JGO-07/app_nube
cd app_nube
npm install
npm start &   # ← cambiar python3 por esto
```

> **Nota:** Actualiza el UserData en `infraestructura-completa.yaml` para usar `npm install && npm start &` en lugar del `python3 -m http.server`.

## Conectar DynamoDB (cuando esté listo)

En `routes/questions.js`, reemplaza el import del mock por:

```js
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });

// PK: "MATERIA#matematicas"  |  SK: "PREGUNTA#001"
const command = new QueryCommand({
  TableName: "exam-questions",
  KeyConditionExpression: "PK = :pk",
  ExpressionAttributeValues: { ":pk": { S: `MATERIA#${materia}` } }
});
const { Items } = await client.send(command);
```

## Conectar Lambda (cuando esté listo)

En `routes/explain.js`, descomenta el bloque `MODO LAMBDA` y setea la variable de entorno:

```bash
export LAMBDA_URL=https://tu-lambda-url.lambda-url.us-east-1.on.aws/
```

La Lambda recibe:
```json
{
  "resultados": [...],
  "materia": "matematicas"
}
```
Y devuelve los mismos resultados con un campo `explicacion` generado por ChatGPT.

## Estructura esperada en DynamoDB

| Atributo     | Tipo   | Ejemplo                        |
|-------------|--------|-------------------------------|
| PK          | String | `MATERIA#matematicas`         |
| SK          | String | `PREGUNTA#001`                |
| id          | String | `mat-001`                     |
| pregunta    | String | `¿Cuál es la raíz de...?`    |
| opciones    | List   | `["a", "b", "c", "d"]`       |
| correcta    | Number | `0`                           |
| dificultad  | String | `media`                       |

## Notas sobre la arquitectura CloudFormation

- Las instancias EC2 están en subnets **privadas** — el NAT Gateway permite el acceso a internet saliente para `npm install` y `git clone`.
- El **VPC Endpoint de DynamoDB** evita que el tráfico a Dynamo salga a internet — más rápido y sin costo de transferencia.
- El **ALB** en subnets públicas expone el puerto 80 y hace forward al puerto 3000 de las instancias.
- El **Bastion Host** permite SSH a las instancias privadas para debugging.
