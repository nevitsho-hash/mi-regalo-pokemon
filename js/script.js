// 1. Sonidos (Corregido a tu carpeta 'sng')
const sonidoBoton = new Audio('./assets/sng/clic.mp3');
const sonidoCaptura = new Audio('./assets/sng/captura.wav');

// 2. Base de datos (Nombres en MAYÚSCULAS y extensión .png)
const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "./assets/img/BEAUTIFLY.png" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "./assets/img/SNORLAX.png" 
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "./assets/img/SWALOT.png" 
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "./assets/img/TOTODILE.png" 
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "./assets/img/UMBREON.png" 
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "./assets/img/JIGGLYPUFF.png" 
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "./assets/img/GENGAR.png" 
    }
};

let html5QrCode;

function activarEscaner() {
    // Intentamos sonar el clic
    sonidoBoton.play().catch(() => console.log("Audio clic en espera"));

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
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                actualizarPantalla(pokemonDB[code]);
            } else {
                actualizarPantalla({ 
                    text: "QR NO REGISTRADO:<br>" + code, 
                    sprite: "./assets/img/GENGAR.png" 
                });
            }
            html5QrCode.stop();
        }
    ).catch((err) => {
        console.error("Error cámara:", err);
    });
}

function actualizarPantalla(data) {
    // Sonido de captura
    sonidoCaptura.play().catch(() => console.log("Audio captura en espera"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const imgElement = document.getElementById('main-sprite');
    imgElement.src = data.sprite;

    // Si la imagen falla, intentamos cargarla en minúsculas por si acaso
    imgElement.onerror = function() {
        if (this.src.includes('.png')) {
            this.src = this.src.replace('.png', '.PNG');
        }
    };
}
