// 1. Configuración de Sonidos (Rutas relativas desde la raíz)
const sonidoBoton = new Audio('assets/snd/clic.mp3');
const sonidoCaptura = new Audio('assets/snd/captura.wav');

// 2. Base de Datos (Asegúrate de que los nombres coincidan con tus QR)
const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/BEAUTIFLY.PNG" // Ruta en mayúsculas
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "assets/img/SNORLAX.PNG" 
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "assets/img/SWALOT.PNG" 
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "assets/img/TOTODILE.PNG" 
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/UMBREON.PNG" 
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "assets/img/JIGGLYPUFF.PNG" 
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "assets/img/GENGAR.PNG" 
    }
};

let html5QrCode;

function activarEscaner() {
    // Intentar sonido del botón
    sonidoBoton.play().catch(e => console.log("Sonido clic bloqueado"));

    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            console.log("QR Detectado:", decodedText); // Ver qué lee el móvil
            let code = decodedText.toUpperCase().trim();
            
            if (pokemonDB[code]) {
                actualizarPantalla(pokemonDB[code]);
            } else {
                actualizarPantalla({ 
                    text: "QR NO VALIDO:<br>" + code, 
                    sprite: "assets/img/gengar.png" 
                });
            }
            html5QrCode.stop();
        }
    ).catch((err) => {
        console.error("Error al iniciar cámara:", err);
    });
}

function actualizarPantalla(data) {
    // Intentar sonido de captura
    sonidoCaptura.play().catch(e => console.log("Sonido captura bloqueado"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}
