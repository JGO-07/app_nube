// scripts/seed-dynamo.js
// Ejecutar: node scripts/seed-dynamo.js
// Requiere credenciales activas del Learner Lab en ~/.aws/credentials

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

// En Learner Lab las credenciales temporales van en ~/.aws/credentials
// O puedes setearlas como variables de entorno antes de correr el script:
// export AWS_ACCESS_KEY_ID=...
// export AWS_SECRET_ACCESS_KEY=...
// export AWS_SESSION_TOKEN=...   ← este es el que Learner Lab agrega extra

const client = new DynamoDBClient({ region: "us-east-1" });

const preguntas = [
  // MATEMÁTICAS
  {
    PK: "MATERIA#matematicas", SK: "PREGUNTA#mat-001",
    id: "mat-001", materia: "matematicas",
    pregunta: "¿Cuál es el resultado de resolver la ecuación 2x² - 8 = 0?",
    opciones: ["x = ±2", "x = ±4", "x = 2", "x = -4"],
    correcta: 0, dificultad: "media"
  },
  {
    PK: "MATERIA#matematicas", SK: "PREGUNTA#mat-002",
    id: "mat-002", materia: "matematicas",
    pregunta: "Si log₂(x) = 5, ¿cuál es el valor de x?",
    opciones: ["10", "25", "32", "64"],
    correcta: 2, dificultad: "media"
  },
  {
    PK: "MATERIA#matematicas", SK: "PREGUNTA#mat-003",
    id: "mat-003", materia: "matematicas",
    pregunta: "¿Cuál es la derivada de f(x) = 3x³ - 2x + 7?",
    opciones: ["9x² - 2", "3x² - 2", "9x² + 7", "6x - 2"],
    correcta: 0, dificultad: "media"
  },
  {
    PK: "MATERIA#matematicas", SK: "PREGUNTA#mat-004",
    id: "mat-004", materia: "matematicas",
    pregunta: "En un triángulo rectángulo, si los catetos miden 6 y 8, ¿cuánto mide la hipotenusa?",
    opciones: ["12", "10", "14", "9"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#matematicas", SK: "PREGUNTA#mat-005",
    id: "mat-005", materia: "matematicas",
    pregunta: "¿Cuál es el valor de sen(45°)?",
    opciones: ["√3/2", "1/2", "√2/2", "1"],
    correcta: 2, dificultad: "media"
  },
  // ESPAÑOL
  {
    PK: "MATERIA#espanol", SK: "PREGUNTA#esp-001",
    id: "esp-001", materia: "espanol",
    pregunta: "¿Cuál de las siguientes oraciones tiene uso correcto del punto y coma?",
    opciones: [
      "Llegué tarde; porque había mucho tráfico.",
      "Compré manzanas, peras y uvas; también traje pan y leche.",
      "El examen fue difícil; pero lo aprobé.",
      "Me gusta leer; novelas de ciencia ficción."
    ],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#espanol", SK: "PREGUNTA#esp-002",
    id: "esp-002", materia: "espanol",
    pregunta: "¿Qué figura retórica se usa en la frase 'el tiempo es oro'?",
    opciones: ["Símil", "Metáfora", "Hipérbole", "Personificación"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#espanol", SK: "PREGUNTA#esp-003",
    id: "esp-003", materia: "espanol",
    pregunta: "¿Cuál es el sujeto en: 'Los estudiantes de la universidad aprobaron el examen'?",
    opciones: [
      "aprobaron el examen",
      "Los estudiantes",
      "Los estudiantes de la universidad",
      "de la universidad"
    ],
    correcta: 2, dificultad: "media"
  },
  {
    PK: "MATERIA#espanol", SK: "PREGUNTA#esp-004",
    id: "esp-004", materia: "espanol",
    pregunta: "¿En qué caso se escribe 'haber' y no 'a ver'?",
    opciones: [
      "Cuando indica percepción visual",
      "Cuando es verbo auxiliar o impersonal",
      "Siempre antes de un verbo",
      "Solo en oraciones interrogativas"
    ],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#espanol", SK: "PREGUNTA#esp-005",
    id: "esp-005", materia: "espanol",
    pregunta: "¿Cuál de estas palabras tiene acento diacrítico?",
    opciones: ["Árbol", "Tú (pronombre)", "Canción", "Fácil"],
    correcta: 1, dificultad: "media"
  },
  // CIENCIAS
  {
    PK: "MATERIA#ciencias", SK: "PREGUNTA#cien-001",
    id: "cien-001", materia: "ciencias",
    pregunta: "¿Cuál es la función principal de las mitocondrias en la célula?",
    opciones: ["Síntesis de proteínas", "Producción de energía (ATP)", "Almacenamiento de agua", "División celular"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#ciencias", SK: "PREGUNTA#cien-002",
    id: "cien-002", materia: "ciencias",
    pregunta: "¿Qué tipo de enlace químico se forma cuando dos átomos comparten electrones?",
    opciones: ["Enlace iónico", "Enlace covalente", "Enlace metálico", "Enlace de hidrógeno"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#ciencias", SK: "PREGUNTA#cien-003",
    id: "cien-003", materia: "ciencias",
    pregunta: "La segunda ley de Newton establece que la fuerza es igual a:",
    opciones: ["velocidad × tiempo", "masa × aceleración", "masa × velocidad", "energía / tiempo"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#ciencias", SK: "PREGUNTA#cien-004",
    id: "cien-004", materia: "ciencias",
    pregunta: "¿Cuál es el proceso por el que las plantas producen su propio alimento usando luz solar?",
    opciones: ["Respiración celular", "Fotosíntesis", "Fermentación", "Digestión"],
    correcta: 1, dificultad: "media"
  },
  {
    PK: "MATERIA#ciencias", SK: "PREGUNTA#cien-005",
    id: "cien-005", materia: "ciencias",
    pregunta: "¿Qué partícula subatómica tiene carga negativa?",
    opciones: ["Protón", "Neutrón", "Electrón", "Fotón"],
    correcta: 2, dificultad: "media"
  }
];

async function seed() {
  console.log(`Cargando ${preguntas.length} preguntas a DynamoDB...\n`);
  let ok = 0, fail = 0;

  for (const item of preguntas) {
    try {
      await client.send(new PutItemCommand({
        TableName: "exam-questions",
        Item: marshall(item)
      }));
      console.log(`  ✅ ${item.SK}`);
      ok++;
    } catch (err) {
      console.error(`  ❌ ${item.SK} — ${err.message}`);
      fail++;
    }
  }

  console.log(`\nListo: ${ok} insertadas, ${fail} fallidas.`);
}

seed();