export function mostrarResultado(destino) {
    const surveySection = document.getElementById('survey-section');
    const resultSection = document.getElementById('result-section');
    
    // Inyectar textos
    document.getElementById('result-title').textContent = destino.titulo;
    document.getElementById('result-desc').textContent = destino.descripcion;
    
    // Inyectar el visualizador 360 (en este caso un iframe de YouTube)
    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = `<iframe src="${destino.videoUrl}" allowfullscreen></iframe>`;

    // Cambiar la vista
    surveySection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

export function reiniciarVista() {
    document.getElementById('travel-form').reset();
    document.getElementById('media-container').innerHTML = ''; // Limpiar video
    
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('survey-section').classList.remove('hidden');
}