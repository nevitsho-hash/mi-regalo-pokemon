// 1. Sonidos generales
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/captura.wav');

// 2. Base de datos con los gritos personalizados (Asegúrate de subirlos a assets/sng/)
const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/BEAUTIFLY.png",
        cry: "assets/sng/beautifly.mp3" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "assets/img/SNORLAX.png",
        cry: "assets/sng/snorlax.mp3"
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "assets/img/SWALOT.png",
        cry: "assets/sng/swalot.mp3"
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "assets/img/TOTODILE.png",
        cry: "assets/sng/totodile.mp3"
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/UMBREON.png",
        cry: "assets/sng/umbreon.mp3"
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "assets/img/JIGGLYPUFF.png",
        cry: "assets/sng/jigglypuff.mp3"
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "assets/img/GENGAR.png",
        cry: "assets/sng/gengar.mp3"
    }
};

let html5QrCode;
let pokemonDetectado = null; // Para guardar al Pokémon antes de pulsar "Capturar"

// ... (Variables iniciales y pokemonDB se mantienen igual) ...

function activarEscaner() {
    // Solo suena el clic del botón verde al inicio
    sonidoBoton.play().catch(() => {});
    
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
                
                // AQUÍ NO SUENA NADA TODAVÍA, solo mostramos visualmente
                html5QrCode.stop().then(() => {
                    document.getElementById('reader').style.display = 'none';
                    document.getElementById('pokedex-content').style.display = 'flex';
                    
                    document.getElementById('main-text').innerHTML = pokemonDetectado.text;
                    document.getElementById('main-sprite').src = pokemonDetectado.sprite;
                    
                    // Mostramos el botón rojo
                    document.getElementById('btn-capturar').style.display = 'block';
                });
            }
        }
    ).catch(err => console.error(err));
}

// ESTA ES LA PARTE CLAVE: El botón activa la secuencia de audio
document.getElementById('btn-capturar').onclick = function() {
    this.style.display = 'none'; // Desaparece el botón al pulsar

    // 1. Suena la Pokéball (captura.wav)
    sonidoCaptura.play().catch(e => console.log("Error captura:", e));
    
    // 2. Esperamos 1.2 segundos y suena el grito del Pokémon
    setTimeout(() => {
        const audioGrito = new Audio(pokemonDetectado.cry);
        audioGrito.play().catch(e => console.log("Error grito:", e));
    }, 1200);
};

    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}
