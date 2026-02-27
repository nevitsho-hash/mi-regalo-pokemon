// 1. Forzamos la carga de sonidos con rutas relativas a la raíz
const sonidoBoton = new Audio('assets/snd/clic.mp3');
const sonidoCaptura = new Audio('assets/snd/captura.wav');

// Ajustes de compatibilidad
sonidoBoton.preload = 'auto';
sonidoCaptura.preload = 'auto';

const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/beautifly.png" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "assets/img/snorlax.png" 
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "assets/img/swalot.png" 
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "assets/img/totodile.png" 
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/umbreon.png" 
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "assets/img/jigglypuff.png" 
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "assets/img/gengar.png" 
    }
};

let html5QrCode;

function activarEscaner() {
    // Intentar reproducir sonido del botón (clic)
    sonidoBoton.play().catch(e => console.warn("Audio bloqueado inicialmente:", e));

    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                actualizarPantalla(pokemonDB[code]);
            } else {
                actualizarPantalla({ 
                    text: "ERROR:<br>POKEMON NO<br>REGISTRADO", 
                    sprite: "assets/img/gengar.png" 
                });
            }
            html5QrCode.stop();
        }
    ).catch((err) => {
        console.error(err);
        document.getElementById('pokedex-content').style.display = 'flex';
        document.getElementById('reader').style.display = 'none';
    });
}

function actualizarPantalla(data) {
    // Sonido de captura
    sonidoCaptura.play().catch(e => console.warn("Error al sonar captura:", e));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}
