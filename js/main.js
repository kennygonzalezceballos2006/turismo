import { destinos, preguntas, calcularResultado } from './survey.js';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Menú hamburguesa (móvil/tablet)
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    function cerrarMenu() {
        if (!mainNav) return;
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const abierto = mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(abierto));
            menuToggle.innerHTML = `<i class="fa-solid ${abierto ? 'fa-xmark' : 'fa-bars'}"></i>`;
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) cerrarMenu();
    });

    // 1. Smooth Scrolling
    const links = document.querySelectorAll('.navbar a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            cerrarMenu();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 2. Lógica del Test / Encuesta
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizModal = document.getElementById('quiz-modal');
    const closeQuizBtn = document.getElementById('close-quiz');
    const questionTitle = document.getElementById('quiz-question-title');
    const optionsContainer = document.getElementById('quiz-options-container');
    const nextBtn = document.getElementById('next-question-btn');
    const progressText = document.getElementById('quiz-progress');

    const quizQuestionsView = document.getElementById('quiz-questions-view');
    const quizResultView = document.getElementById('quiz-result-view');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    const open360ResultBtn = document.getElementById('open-360-result-btn');

    let currentQuestionIndex = 0;
    let userAnswers = {};
    let destinoGanadorKey = null;

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            userAnswers = {};
            destinoGanadorKey = null;

            // Asegurar visibilidad correcta de cada contenedor
            quizQuestionsView.classList.remove('hidden');
            quizResultView.classList.add('hidden');

            quizModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
            renderQuestion();
        });
    }

    function renderQuestion() {
        const q = preguntas[currentQuestionIndex];
        progressText.textContent = `Pregunta ${currentQuestionIndex + 1} de ${preguntas.length}`;
        questionTitle.textContent = q.texto;
        optionsContainer.innerHTML = '';
        nextBtn.disabled = true;

        q.opciones.forEach((opt) => {
            const label = document.createElement('label');
            label.className = 'quiz-option-label';
            label.innerHTML = `
                <input type="radio" name="q_option" value="${opt.destino}">
                <span>${opt.texto}</span>
            `;
            label.addEventListener('click', () => {
                nextBtn.disabled = false;
            });
            optionsContainer.appendChild(label);
        });

        nextBtn.textContent = (currentQuestionIndex === preguntas.length - 1) ? 'Ver mi resultado' : 'Siguiente';
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="q_option"]:checked');
            if (!selected) return;

            userAnswers[currentQuestionIndex] = selected.value;

            if (currentQuestionIndex < preguntas.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                // Calcular ganador una vez finalizado todo el cuestionario
                destinoGanadorKey = calcularResultado(userAnswers);
                const destinoInfo = destinos[destinoGanadorKey];

                resultTitle.textContent = destinoInfo.titulo;
                resultDesc.textContent = destinoInfo.descripcion;

                // Ocultar preguntas y mostrar la vista final del resultado
                quizQuestionsView.classList.add('hidden');
                quizResultView.classList.remove('hidden');
            }
        });
    }

    if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', () => {
            quizModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        });
    }

    // Botón en la pantalla final para lanzar el visor 360° del resultado
    if (open360ResultBtn) {
        open360ResultBtn.addEventListener('click', () => {
            quizModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
            const data = destinos[destinoGanadorKey];
            if (data) abrirVideo(data);
        });
    }

    // 3. Reproductor 360 con A-Frame (<a-videosphere>)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const container = document.getElementById('vr-container');
    const btnPlayPause = document.getElementById('btn-playpause');
    const btnMute = document.getElementById('btn-mute');

    let video = null;
    let ajuste = null;

    function fovSegunPantalla() {
        return window.innerWidth < window.innerHeight ? 85 : 60;
    }

    function actualizarIconos() {
        if (!video) return;
        btnPlayPause.innerHTML = `<i class="fa-solid ${video.paused ? 'fa-play' : 'fa-pause'}"></i>`;
        btnMute.innerHTML = `<i class="fa-solid ${video.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
    }

    function abrirVideo(data) {
        document.body.classList.add('modal-open');
        modal.classList.remove('hidden');

        const r = data.rotacion || {};
        ajuste = { pitch: r.pitch || 0, yaw: r.yaw || 0, roll: r.roll || 0 };

        container.innerHTML = `
            <a-scene embedded
                     vr-mode-ui="enabled: false"
                     loading-screen="enabled: false"
                     style="width:100%; height:100%">
                <a-assets>
                    <video id="vid360" src="${data.videoUrl}"
                           crossorigin="anonymous" loop muted playsinline
                           webkit-playsinline></video>
                </a-assets>
                <a-videosphere id="esfera" src="#vid360" rotation="${ajuste.pitch} ${-90 + ajuste.yaw} ${ajuste.roll}"></a-videosphere>
                <a-entity camera="fov: ${fovSegunPantalla()}" rotation="0 0 0"
                          look-controls="reverseMouseDrag: true; touchEnabled: true; magicWindowTrackingEnabled: false"
                          wasd-controls="enabled: false"
                          position="0 0 0"></a-entity>
            </a-scene>
        `;

        video = container.querySelector('#vid360');
        video.muted = true;

        const scene = container.querySelector('a-scene');
        if (scene.hasLoaded) {
            video.play().then(actualizarIconos).catch(err => {
                console.error('No se pudo reproducir el video:', err);
                actualizarIconos();
            });
        } else {
            scene.addEventListener('loaded', () => {
                video.play().then(actualizarIconos).catch(err => {
                    console.error('No se pudo reproducir el video:', err);
                    actualizarIconos();
                });
            });
        }
    }

    function cerrarVideo() {
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
            video = null;
        }
        ajuste = null;
        container.innerHTML = '';
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const data = destinos[item.getAttribute('data-scenario')];
            if (data) abrirVideo(data);
        });
    });

    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', () => {
            if (!video) return;
            video.paused ? video.play() : video.pause();
            actualizarIconos();
        });
    }

    if (btnMute) {
        btnMute.addEventListener('click', () => {
            if (!video) return;
            video.muted = !video.muted;
            actualizarIconos();
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', cerrarVideo);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) cerrarVideo();
    });
});