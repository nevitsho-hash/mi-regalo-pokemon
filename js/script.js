// 1. Sonidos base (Asegúrate de que estén en assets/sng/)
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
};

let html5QrCode;

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    
    document.getElementById('pokedex-content').style.display = 'none';
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
                const pokemonData = pokemonDB[code];
                
                html5QrCode.stop().then(() => {
                    // Cambiamos a la pantalla de la Pokédex
                    actualizarPantalla(pokemonData);
                });
            }
        }
    ).catch(err => console.error(err));
}

function actualizarPantalla(data) {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;

    // SECUENCIA DE SONIDO AUTOMÁTICA
    // 1. Sonido de captura inmediato
    sonidoCaptura.play().catch(e => console.log("Error captura:", e));
    
    // 2. Grito del Pokémon tras un breve retraso (1.2 segundos)
    setTimeout(() => {
        const audioGrito = new Audio(data.cry);
        audioGrito.play().catch(e => console.log("Error grito:", e));
    }, 1200);
}
