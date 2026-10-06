// Base de datos local de nuestros escenarios 360 y descripciones
export const destinos = {
    playa: {
        titulo: "San Andrés — Playas con Aventura",
        descripcion: "Tu destino ideal es la Isla de San Andrés. Perfecto si buscas disfrutar del mar turquesa de los siete colores, la arena blanca, deportes acuáticos de aventura y un ambiente dinámico e inolvidable.",
        videoUrl: "img/playa_360.mp4",
        rotacion: { pitch: 0, yaw: 0, roll: 0 } 
    },
    mar: {
        titulo: "Providencia — Aventura Submarina y Tradición",
        descripcion: "Tu destino ideal es la Isla de Providencia. Excelente para sumergirte en barreras arrecifales, bucear con vida marina protegida y conectar de cerca con la cultura y comunidad raizal.",
        videoUrl: "img/buceo_360.mp4",
        rotacion: { pitch: 0, yaw: 0, roll: 0 }
    },
    selva: {
        titulo: "Santa Catalina — Senderismo y Naturaleza",
        descripcion: "Tu destino ideal es la Isla de Santa Catalina. Ideal si deseas desconectarte en senderos ecológicos, bosques de manglar y paisajes tranquilos rodeados de naturaleza virgen sin ruido de motores.",
        videoUrl: "img/selva_360.mp4",
        rotacion: { pitch: 0, yaw: 0, roll: 0 }
    }
};

// Preguntas limpias sin paréntesis
export const preguntas = [
    {
        id: 1,
        texto: "1. ¿Qué tipo de experiencia te gustaría vivir más durante tu visita?",
        opciones: [
            { texto: "Explorar playas y realizar actividades acuáticas de aventura", destino: "playa" },
            { texto: "Conocer tradiciones y compartir con la comunidad local", destino: "mar" },
            { texto: "Disfrutar de un entorno tranquilo y rodeado de naturaleza", destino: "selva" }
        ]
    },
    {
        id: 2,
        texto: "2. ¿Qué clima y ambiente prefieres para disfrutar de tus vacaciones?",
        opciones: [
            { texto: "Cálido y soleado, ideal para actividades de playa y entretenimiento", destino: "playa" },
            { texto: "Cálido, pero acompañado de un ambiente cultural y más natural", destino: "mar" },
            { texto: "Cálido y muy tranquilo, con menor movimiento turístico", destino: "selva" }
        ]
    },
    {
        id: 3,
        texto: "3. ¿Qué actividad te llamaría más la atención?",
        opciones: [
            { texto: "Deportes náuticos, passeos en lancha y vida de playa", destino: "playa" },
            { texto: "Buceo, snorkel en arrecifes y exploración marina", destino: "mar" },
            { texto: "Caminatas por senderos ecológicos y contemplación del paisaje", destino: "selva" }
        ]
    },
    {
        id: 4,
        texto: "4. ¿Qué experiencia gastronómica preferirías?",
        opciones: [
            { texto: "Probar diferentes restaurantes y variedad de platos marinos", destino: "playa" },
            { texto: "Conocer la gastronomía tradicional preparada por habitantes locales", destino: "mar" },
            { texto: "Disfrutar de comida típica en un ambiente sencillo y muy apartado", destino: "selva" }
        ]
    },
    {
        id: 5,
        texto: "5. ¿Qué tipo de ritmo prefieres durante un viaje?",
        opciones: [
            { texto: "Un ritmo dinámico, con variedad de opciones de entretenimiento", destino: "playa" },
            { texto: "Un ritmo cultural y autóctono con contacto comunitario", destino: "mar" },
            { texto: "Un ritmo pausado, totalmente enfocado en el descanso", destino: "selva" }
        ]
    },
    {
        id: 6,
        texto: "6. ¿Qué te gustaría conocer principalmente?",
        opciones: [
            { texto: "Cayos de arena blanca y vida marina en superficie", destino: "playa" },
            { texto: "Grandes barreras de coral y arquitectura autóctona", destino: "mar" },
            { texto: "Bosques de manglar, bahías calmas y espacios poco concurridos", destino: "selva" }
        ]
    },
    {
        id: 7,
        texto: "7. Si tuvieras que elegir el enfoque de tu viaje, ¿cuál preferirías?",
        opciones: [
            { texto: "Una experiencia marina, alegre y turística", destino: "playa" },
            { texto: "Una experiencia inmersiva en biodiversidad submarina y cultura", destino: "mar" },
            { texto: "Una experiencia de relajación, naturaleza y caminatas", destino: "selva" }
        ]
    }
];

export function calcularResultado(respuestas) {
    const conteo = { playa: 0, mar: 0, selva: 0 };
    Object.values(respuestas).forEach(destino => {
        if (conteo[destino] !== undefined) conteo[destino]++;
    });

    let ganador = 'playa';
    let maxVotos = -1;

    for (const [destino, votos] of Object.entries(conteo)) {
        if (votos > maxVotos) {
            maxVotos = votos;
            ganador = destino;
        }
    }
    return ganador;
}