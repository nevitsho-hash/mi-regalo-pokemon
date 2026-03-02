// Audios y Precarga
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/captura.wav'); 
const sonidoEspera = new Audio('assets/sng/espera-pokeball.mp3'); 

// Precarga de imágenes críticas
const preAnillo = new Image(); preAnillo.src = "assets/img/anillo.png"; 
const preCofre = new Image(); preCofre.src = "assets/img/gengar-cofre.png";

let html5QrCode;
let pokemonDetectado = true;
let audioDesbloqueado = false; // Control de seguridad para el primer toque

let pokemonActualData = { 
    text: "GENGAR", 
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", 
    catchRate: 0.1, 
    cry: "assets/sng/gengar.mp3" 
};

const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5, cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.2, cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡SWALOT!", sprite: "assets/img/SWALOT.png", catchRate: 0.4, cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡TOTODILE!", sprite: "assets/img/TOTODILE.png", catchRate: 0.6, cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡UMBREON!", sprite: "assets/img/UMBREON.png", catchRate: 0.3, cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", catchRate: 0.7, cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡GENGAR!", sprite: "assets/img/GENGAR.png", catchRate: 0.1, cry: "assets/sng/gengar.mp3" }
};

window.addEventListener('DOMContentLoaded', () => {
    html5QrCode = new Html5Qrcode("reader");
});

// FUNCIÓN PARA DESBLOQUEAR EL AUDIO EN EL PRIMER CLIC
function desbloquearAudio() {
    if (!audioDesbloqueado) {
        // Reproducimos y pausamos instantáneamente todos los audios
        [sonidoBoton, sonidoCaptura, sonidoEspera].forEach(audio => {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(() => {});
        });
        audioDesbloqueado = true;
    }
}

async function activarEscaner() {
    desbloquearAudio(); // Desbloqueamos el canal al primer toque del botón verde
    sonidoBoton.play().catch(() => {}); 
    
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    document.querySelectorAll('.led').forEach(l => {
        l.classList.remove('success');
        l.classList.add('animating');
    });

    try {
        await html5QrCode.start({ facingMode: "environment" }, { fps: 20, qrbox: 250 }, (text) => {
            let code = text.toUpperCase().trim();
            if (pokemonDB[code]) {
                html5QrCode.stop().then(() => {
                    pokemonActualData = pokemonDB[code];
                    actualizarPantalla();
                });
            }
        });
    } catch (err) { restaurarInterfaz(); }
}

function actualizarPantalla() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = pokemonActualData.text;
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating', 'success'));
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = pokemonActualData.sprite;
    sprite.style.opacity = "1";
    sprite.style.transform = "scale(1)";
    sprite.onclick = null; 
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow', 'clickable-chest', 'ring-reveal');
    
    // Reproducción del grito con un pequeño delay para asegurar el enfoque
    setTimeout(() => {
        const grito = new Audio(pokemonActualData.cry);
        grito.play().catch(e => console.log("Audio bloqueado:", e));
    }, 100);
    
    pokemonDetectado = true;
}

// ... (Resto de funciones capturarNormal, capturarSuper, iniciarCaptura y abrirCofre se mantienen igual)
