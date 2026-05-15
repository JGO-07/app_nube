// data/questions.js
// Estructura compatible con DynamoDB:
// PK: "MATERIA#matematicas" | SK: "PREGUNTA#001"
// Cuando conectes Dynamo, este módulo se reemplaza por llamadas al SDK

const questions = {
  matematicas: [
    {
      id: "mat-001",
      materia: "matematicas",
      pregunta: "¿Cuál es el resultado de resolver la ecuación 2x² - 8 = 0?",
      opciones: ["x = ±2", "x = ±4", "x = 2", "x = -4"],
      correcta: 0,
      dificultad: "media"
    },
    {
      id: "mat-002",
      materia: "matematicas",
      pregunta: "Si log₂(x) = 5, ¿cuál es el valor de x?",
      opciones: ["10", "25", "32", "64"],
      correcta: 2,
      dificultad: "media"
    },
    {
      id: "mat-003",
      materia: "matematicas",
      pregunta: "¿Cuál es la derivada de f(x) = 3x³ - 2x + 7?",
      opciones: ["9x² - 2", "3x² - 2", "9x² + 7", "6x - 2"],
      correcta: 0,
      dificultad: "media"
    },
    {
      id: "mat-004",
      materia: "matematicas",
      pregunta: "En un triángulo rectángulo, si los catetos miden 6 y 8, ¿cuánto mide la hipotenusa?",
      opciones: ["12", "10", "14", "9"],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "mat-005",
      materia: "matematicas",
      pregunta: "¿Cuál es el valor de sen(45°)?",
      opciones: ["√3/2", "1/2", "√2/2", "1"],
      correcta: 2,
      dificultad: "media"
    }
  ],
  espanol: [
    {
      id: "esp-001",
      materia: "espanol",
      pregunta: "¿Cuál de las siguientes oraciones tiene uso correcto del punto y coma?",
      opciones: [
        "Llegué tarde; porque había mucho tráfico.",
        "Compré manzanas, peras y uvas; también traje pan y leche.",
        "El examen fue difícil; pero lo aprobé.",
        "Me gusta leer; novelas de ciencia ficción."
      ],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "esp-002",
      materia: "espanol",
      pregunta: "¿Qué figura retórica se usa en la frase 'el tiempo es oro'?",
      opciones: ["Símil", "Metáfora", "Hipérbole", "Personificación"],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "esp-003",
      materia: "espanol",
      pregunta: "¿Cuál es el sujeto en la oración: 'Los estudiantes de la universidad aprobaron el examen'?",
      opciones: [
        "aprobaron el examen",
        "Los estudiantes",
        "Los estudiantes de la universidad",
        "de la universidad"
      ],
      correcta: 2,
      dificultad: "media"
    },
    {
      id: "esp-004",
      materia: "espanol",
      pregunta: "¿En qué caso se escribe 'haber' y no 'a ver'?",
      opciones: [
        "Cuando indica percepción visual",
        "Cuando es verbo auxiliar o impersonal",
        "Siempre antes de un verbo",
        "Solo en oraciones interrogativas"
      ],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "esp-005",
      materia: "espanol",
      pregunta: "¿Cuál de estas palabras tiene acento diacrítico?",
      opciones: ["Árbol", "Tú (pronombre)", "Canción", "Fácil"],
      correcta: 1,
      dificultad: "media"
    }
  ],
  ciencias: [
    {
      id: "cien-001",
      materia: "ciencias",
      pregunta: "¿Cuál es la función principal de las mitocondrias en la célula?",
      opciones: [
        "Síntesis de proteínas",
        "Producción de energía (ATP)",
        "Almacenamiento de agua",
        "División celular"
      ],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "cien-002",
      materia: "ciencias",
      pregunta: "¿Qué tipo de enlace químico se forma cuando dos átomos comparten electrones?",
      opciones: ["Enlace iónico", "Enlace covalente", "Enlace metálico", "Enlace de hidrógeno"],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "cien-003",
      materia: "ciencias",
      pregunta: "La segunda ley de Newton establece que la fuerza es igual a:",
      opciones: ["velocidad × tiempo", "masa × aceleración", "masa × velocidad", "energía / tiempo"],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "cien-004",
      materia: "ciencias",
      pregunta: "¿Cuál es el proceso por el que las plantas producen su propio alimento usando luz solar?",
      opciones: ["Respiración celular", "Fotosíntesis", "Fermentación", "Digestión"],
      correcta: 1,
      dificultad: "media"
    },
    {
      id: "cien-005",
      materia: "ciencias",
      pregunta: "¿Qué partícula subatómica tiene carga negativa?",
      opciones: ["Protón", "Neutrón", "Electrón", "Fotón"],
      correcta: 2,
      dificultad: "media"
    }
  ]
};

module.exports = questions;
