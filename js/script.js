// 1. GESTIÓN CENTRALIZADA DE AUDIOS
const sonidos = {
    boton: new Audio('assets/sng/clic.mp3'),
    captura: new Audio('assets/sng/captura.wav'),
    espera: new Audio('assets/sng/espera-pokeball.mp3'),
    escapo: new Audio('assets/sng/escapo.mp3'),
    brillo: new Audio('assets/sng/brillocofre.mp3')
};

const canalGrito = new Audio();
let html5QrCode = null; // Variable única global
let pokemonDetectado = true;
let audioDesbloqueado = false;
let pokemonActualData = null;

const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5, cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.5, cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡SWALOT!", sprite: "assets/img/SWALOT.png", catchRate: 0.5, cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡TOTODILE!", sprite: "assets/img/TOTODILE.png", catchRate: 0.5, cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡UMBREON!", sprite: "assets/img/UMBREON.png", catchRate: 0.5, cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", catchRate: 0.5, cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡GENGAR!", sprite: "assets/img/GENGAR.png", catchRate: 0.2, cry: "assets/sng/gengar.mp3" }
};

window.addEventListener('DOMContentLoaded', () => {
    // Inicialización movida dentro de activarEscaner para mayor limpieza
});

function desbloquearAudio() {
    if (!audioDesbloqueado) {
        Object.values(sonidos).forEach(s => {
            s.volume = 0.1;
            s.play().then(() => { s.pause(); s.currentTime = 0; s.volume = 1; }).catch(() => {});
        });
        canalGrito.volume = 1.0;
        canalGrito.play().then(() => { canalGrito.pause(); canalGrito.volume = 1.0; }).catch(() => {});
        audioDesbloqueado = true;
    }
}

async function activarEscaner() {
    desbloquearAudio(); 

    const readerDiv = document.getElementById('reader');
    const pokedexContent = document.getElementById('pokedex-content');
    const sprite = document.getElementById('main-sprite');
    
    // 1. LIMPIEZA ABSOLUTA: Destruimos cualquier rastro antes de empezar
    if (html5QrCode) {
        try {
            await html5QrCode.stop();
            await html5QrCode.clear();
        } catch (e) {
            readerDiv.innerHTML = ""; 
        }
        html5QrCode = null;
    }

    // 2. RESET VISUAL
    pokemonDetectado = true;
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow', 'clickable-chest', 'ring-reveal', 'anillo-animado', 'captured-success');
    sprite.style.opacity = "1";
    sprite.style.transform = "scale(1)";
    sprite.onclick = null;

    // 3. GESTIÓN DE CAPAS: Preparamos el escenario
    pokedexContent.style.display = 'none';
    readerDiv.style.display = 'block';
    readerDiv.style.zIndex = "1000"; 

    // 4. RETRASO DE SEGURIDAD: Dejamos que el navegador renderice el div negro
    setTimeout(async () => {
        try {
            html5QrCode = new Html5Qrcode("reader");

            await html5QrCode.start(
                { facingMode: "environment" }, 
                { fps: 20, qrbox: { width: 250, height: 250 } }, 
                (text) => {
                    let code = text.toUpperCase().trim();
                    if (pokemonDB[code]) {
                        canalGrito.src = pokemonDB[code].cry;
                        canalGrito.load();
                        
                        html5QrCode.stop().then(() => {
                            html5QrCode.clear();
                            readerDiv.style.zIndex = "1";
                            pokemonActualData = pokemonDB[code];
                            actualizarPantalla();
                        });
                    }
                }
            );

            // Activamos LEDs solo si la cámara arrancó bien
            document.querySelectorAll('.led').forEach(l => { 
                l.classList.remove('success'); 
                l.classList.add('animating'); 
            });

        } catch (err) { 
            console.error("Error crítico de cámara:", err);
            restaurarInterfaz(); 
        }
    }, 150); // El pequeño respiro para el navegador
}

function actualizarPantalla() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = pokemonActualData.text;
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating', 'success'));
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = pokemonActualData.sprite;
    
    setTimeout(() => {
        canalGrito.play().catch(() => {
            setTimeout(() => canalGrito.play(), 300);
        });
    }, 200);
    pokemonDetectado = true;
}

// ... (Resto de funciones: capturarNormal, capturarSuper, iniciarCaptura, abrirCofre se mantienen igual)

function restaurarInterfaz() {
    const readerDiv = document.getElementById('reader');
    readerDiv.style.display = 'none'; 
    readerDiv.style.zIndex = "1"; 
    document.getElementById('pokedex-content').style.display = 'flex'; 
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating', 'success'));
    pokemonDetectado = true;
}
