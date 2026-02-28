// Forzamos las rutas para que el navegador no se pierda
const sonidoBoton = new Audio('./assets/snd/clic.mp3'); // Asegúrate que en GitHub sea clic.mp3 en minúsculas
const sonidoCaptura = new Audio('./assets/snd/captura.wav'); // Asegúrate que en GitHub sea captura.wav en minúsculas

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
    // Intentar sonido (ahora en mayúsculas)
    sonidoBoton.play().catch(e => console.log("Audio de clic falló"));

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
                actualizarPantalla({ text: "ERROR:<br>POKEMON NO<br>REGISTRADO", sprite: "./assets/img/GENGAR.png" }); // Ruta Gengar inicio
            }
            html5QrCode.stop();
        }
    ).catch(err => console.error(err));
}

function actualizarPantalla(data) {
    // Intentar sonido (ahora en mayúsculas)
    sonidoCaptura.play().catch(e => console.log("Audio de captura falló"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const imgElement = document.getElementById('main-sprite');
    imgElement.src = data.sprite;

    // SISTEMA DE EMERGENCIA: Si no carga la imagen, avisa qué ruta falló
    imgElement.onerror = function() {
        if (this.src.includes('.png')) {
            // Intentamos cargarla en mayúsculas automáticamente
            this.src = this.src.replace('.png', '.PNG').toLowerCase();
        } else {
            document.getElementById('main-text').innerHTML = "ERROR CARGA:<br>" + data.sprite; // Si falla, avisa qué ruta falló
        }
    };
}
