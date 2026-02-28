// 1. Sonidos (Rutas limpias a tu carpeta 'sng')
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/captura.wav');

// 2. Base de datos (Nombres de archivos tal cual están en tu GitHub)
const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/BEAUTIFLY.png" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "assets/img/SNORLAX.png" 
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "assets/img/SWALOT.png" 
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "assets/img/TOTODILE.png" 
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/UMBREON.png" 
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "assets/img/JIGGLYPUFF.png" 
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "assets/img/GENGAR.png" 
    }
};

let html5QrCode;

function activarEscaner() {
    // Intentamos reproducir el sonido del clic
    sonidoBoton.play().catch(() => console.log("Esperando interacción para audio"));

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
                    text: "QR NO RECONOCIDO:<br>" + code, 
                    sprite: "assets/img/GENGAR.png" 
                });
            }
            html5QrCode.stop();
        }
    ).catch((err) => console.error("Error de cámara:", err));
}

function actualizarPantalla(data) {
    // Sonido de captura (Ya sabemos que funciona, ¡genial!)
    sonidoCaptura.play().catch(() => console.log("Audio de captura bloqueado"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const imgElement = document.getElementById('main-sprite');
    
    // 1. Intentamos la ruta que me dijiste: BEAUTIFLY.png
    imgElement.src = data.sprite;

    // 2. SISTEMA DE RESCATE AUTOMÁTICO
    imgElement.onerror = function() {
        console.log("Fallo con .png, intentando variantes...");
        
        // Si falló con .png, intenta con .PNG (mayúsculas)
        if (this.src.includes('.png')) {
            this.src = this.src.replace('.png', '.PNG');
        } 
        // Si aun así falla, podría ser que el archivo no tiene la ruta assets/ delante
        else if (!this.src.includes('assets/img/')) {
            this.src = 'assets/img/' + data.sprite.split('/').pop();
        }
    };
}
