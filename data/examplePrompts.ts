
import { ExamplePrompt } from "../types";

export const examplePrompts: ExamplePrompt[] = [
  {
    id: "dev-1",
    category: "Desarrollo",
    title: "Generador de Tests Unitarios",
    content: "Actúa como un Ingeniero de Software Senior experto en Jest y React. Escribe pruebas unitarias para el siguiente componente de botón [insertar código aquí].\n\nRequisitos:\n1. Cubre el renderizado básico.\n2. Cubre el evento onClick.\n3. Cubre estados deshabilitados.\n4. Usa 'describe' e 'it' blocks anidados.\n5. No incluyas explicaciones, solo el código.",
    explanation: "Define claramente el ROL (Ingeniero Senior), el CONTEXTO (Jest/React), la TAREA específica (tests unitarios) y RESTRICCIONES de formato (solo código)."
  },
  {
    id: "hr-1",
    category: "RRHH",
    title: "Preguntas de Entrevista Conductual",
    content: "Actúa como Gerente de Talent Acquisition. Genera 5 preguntas de entrevista conductual para un puesto de Project Manager Senior.\n\nContexto: La empresa está pasando por una fusión y hay mucha resistencia al cambio.\nObjetivo: Evaluar adaptabilidad y liderazgo en crisis.\nFormato: Lista con la pregunta y qué indicador buscar en la respuesta (método STAR).",
    explanation: "Añade un CONTEXTO crítico (fusión de empresas) que cambia totalmente el enfoque de las preguntas generadas."
  },
  {
    id: "eng-1",
    category: "Ingeniería",
    title: "Análisis de Riesgos (Seguridad)",
    content: "Actúa como Ingeniero de Seguridad Industrial. Realiza un análisis preliminar de riesgos para una tarea de soldadura en altura.\n\nFormato de Salida: Tabla Markdown con columnas (Peligro, Riesgo, Medida de Control).\nRestricciones: Prioriza controles de ingeniería sobre EPP.\nAudiencia: Supervisores de planta.",
    explanation: "Especifica el FORMATO (Tabla) y una RESTRICCIÓN técnica importante (jerarquía de controles) para obtener una respuesta profesional."
  },
  {
    id: "write-1",
    category: "Escritura",
    title: "Historia de Ciencia Ficción",
    content: "Escribe una historia corta de ciencia ficción (máximo 300 palabras) sobre un robot que descubre que le gustan las flores.\n\nTono: Melancólico pero esperanzador.\nEstructura:\n- Introducción: El robot en su trabajo rutinario.\n- Nudo: El descubrimiento de la flor.\n- Desenlace: Un pequeño acto de rebelión.\n\nEvita clichés como 'el robot cobra conciencia y mata humanos'.",
    explanation: "Excelente uso de RESTRICCIONES NEGATIVAS (evitar clichés), estructura paso a paso y control de tono y longitud."
  },
  {
    id: "legal-1",
    category: "Legal",
    title: "Simplificación de Cláusula",
    content: "Actúa como Abogado Corporativo experto en lenguaje claro (Legal Design). Reescribe la siguiente cláusula de indemnización para que sea comprensible para un freelancer sin conocimientos legales.\n\nCláusula: [Insertar texto legal complejo].\n\nObjetivo: Mantener la validez legal pero eliminar jerga innecesaria.\nTono: Profesional pero accesible.",
    explanation: "Define una transformación clara: de lenguaje técnico a lenguaje llano, manteniendo el ROL de experto para no perder precisión."
  },
  {
    id: "biz-1",
    category: "Negocios",
    title: "Resumen Ejecutivo de Reunión",
    content: "Actúa como Asistente Ejecutivo. Resume las siguientes notas desordenadas de una reunión estratégica.\n\nNotas: [Insertar notas aquí].\n\nSalida requerida:\n1. Decisiones tomadas (Bullet points).\n2. Plan de Acción (Quién, Qué, Cuándo).\n3. Temas aparcados para después.\n\nFormato: Email formal listo para enviar.",
    explanation: "Estructura el caos. Pide secciones específicas (Action Items) y un FORMATO final listo para usar (Email)."
  },
  {
    id: "health-1",
    category: "Salud",
    title: "Explicación de Diagnóstico",
    content: "Actúa como Médico General empático. Explica qué es la 'Hipertensión Arterial' a un paciente de 65 años recién diagnosticado.\n\nRestricciones: No uses terminología médica compleja sin explicarla.\nEnfoque: Céntrate en cambios de estilo de vida factibles.\nTono: Tranquilizador y motivador.",
    explanation: "El ajuste de AUDIENCIA (paciente mayor) y TONO es vital en salud para asegurar la comprensión y adherencia al tratamiento."
  },
  {
    id: "edu-1",
    category: "Educación",
    title: "Plan de Clase (Gamificado)",
    content: "Diseña un plan de clase de 45 minutos sobre 'El Ciclo del Agua' para estudiantes de 10 años.\n\nRequisito: Incluye una actividad de gamificación o juego de roles.\nEstructura:\n- Objetivo de aprendizaje.\n- Actividad rompehielo (5 min).\n- Desarrollo teórico breve (10 min).\n- Juego (20 min).\n- Cierre y evaluación.",
    explanation: "Pide una ESTRUCTURA temporal detallada y un requisito metodológico específico (gamificación)."
  },
  {
    id: "mkt-1",
    category: "Marketing",
    title: "Post de LinkedIn Viral",
    content: "Crea un post para LinkedIn sobre la importancia del trabajo remoto.\n\nEstructura:\n1. Hook (Gancho): Una frase controvertida o estadística sorprendente.\n2. Cuerpo: 3 beneficios clave con emojis.\n3. Cierre: Una pregunta para generar comentarios.\n\nAudiencia: Líderes de tecnología.\nEstilo: Profesional pero provocador.",
    explanation: "Desglosa la ESTRUCTURA deseada del contenido (Hook-Cuerpo-Cierre), vital para generación de contenido en redes sociales."
  },
  {
    id: "dev-2",
    category: "Desarrollo",
    title: "Refactorización de Código",
    content: "Actúa como un experto en Clean Code. Analiza el siguiente código Python [insertar código] y sugiere una refactorización para mejorar la legibilidad y eficiencia.\n\nSalida esperada:\n1. Lista de problemas detectados.\n2. Código refactorizado.\n3. Breve explicación de los cambios.\n\nPrioriza: Nombres de variables descriptivos y principio DRY.",
    explanation: "Establece el estándar de calidad (Clean Code) y define explícitamente el FORMATO DE SALIDA en tres secciones claras."
  }
];
