import { destinos } from './survey.js';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Menú hamburguesa (móvil/tablet)
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    function cerrarMenu() {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    menuToggle.addEventListener('click', () => {
        const abierto = mainNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(abierto));
        menuToggle.innerHTML = `<i class="fa-solid ${abierto ? 'fa-xmark' : 'fa-bars'}"></i>`;
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) cerrarMenu();
    });

    // 1. Smooth Scrolling para la navegación
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

    // 2. Reproductor 360 con A-Frame (<a-videosphere>)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const container = document.getElementById('vr-container');
    const btnPlayPause = document.getElementById('btn-playpause');
    const btnMute = document.getElementById('btn-mute');

    let video = null;
    let ajuste = null; // {pitch, yaw, roll} de la esfera del video actual

    // El fov de A-Frame es vertical: en pantallas verticales (móvil) hay que ampliarlo
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

        // Se ajusta la cámara (fov: 60) y la esfera para corregir la perspectiva estirada
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
            video.load(); // Libera el archivo de memoria
            video = null;
        }
        ajuste = null;
        container.innerHTML = ''; // Destruye la escena y su contexto WebGL
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const data = destinos[item.getAttribute('data-scenario')];
            if (data) abrirVideo(data);
        });
    });

    btnPlayPause.addEventListener('click', () => {
        if (!video) return;
        video.paused ? video.play() : video.pause();
        actualizarIconos();
    });

    btnMute.addEventListener('click', () => {
        if (!video) return;
        video.muted = !video.muted;
        actualizarIconos();
    });

    // Calibración en vivo de la orientación del video (ver consola F12):
    //   I / K = inclinar adelante/atrás (pitch)   J / L = girar (yaw)   U / O = ladear (roll)
    //   Con Shift los pasos son de 15° en vez de 5°.
    document.addEventListener('keydown', (e) => {
        if (!ajuste || modal.classList.contains('hidden')) return;
        const paso = e.shiftKey ? 15 : 5;
        const k = e.key.toLowerCase();
        const mapa = { i: ['pitch', paso], k: ['pitch', -paso],
                       j: ['yaw', paso],   l: ['yaw', -paso],
                       u: ['roll', paso],  o: ['roll', -paso] };
        if (!mapa[k]) return;
        ajuste[mapa[k][0]] += mapa[k][1];
        container.querySelector('#esfera')
            .setAttribute('rotation', `${ajuste.pitch} ${-90 + ajuste.yaw} ${ajuste.roll}`);
        console.log('rotacion:', JSON.stringify(ajuste));
    });

    // Al girar el dispositivo o cambiar el tamaño, reajustar el campo de visión
    window.addEventListener('resize', () => {
        const cam = container.querySelector('[camera]');
        if (cam) cam.setAttribute('camera', 'fov', fovSegunPantalla());
    });

    closeModalBtn.addEventListener('click', cerrarVideo);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) cerrarVideo();
    });
});