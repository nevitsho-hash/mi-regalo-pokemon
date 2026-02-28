const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/captura.wav');

const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS...", 
        sprite: "assets/img/BEAUTIFLY.png",
        cry: "assets/sng/beautifly.mp3" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!...", 
        sprite: "assets/img/SNORLAX.png",
        cry: "assets/sng/snorlax.mp3"
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!...", 
        sprite: "assets/img/GENGAR.png",
        cry: "assets/sng/gengar.mp3"
    }
    // Añade aquí el resto de tus Pokémon con el mismo formato
};

let html5QrCode;
let pokemonDetectado = null;

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    
    // Resetear visuales
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('btn-capturar').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 200 },
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                pokemonDetectado = pokemonDB[code];
                html5QrCode.stop().then(() => {
                    document.getElementById('reader').style.display = 'none';
                    // Mostramos el botón rojo de capturar
                    document.getElementById('btn-capturar').style.display = 'block';
                });
            }
        }
    ).catch(err => console.error(err));
}

// Configurar la acción del botón capturar
document.getElementById('btn-capturar').onclick = function() {
    this.style.display = 'none';
    actualizarPantalla(pokemonDetectado);
};

function actualizarPantalla(data) {
    // Sonido de captura
    sonidoCaptura.play();
    
    // Grito del Pokémon (1 segundo después)
    setTimeout(() => {
        const audioGrito = new Audio(data.cry);
        audioGrito.play();
    }, 1000);

    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}
