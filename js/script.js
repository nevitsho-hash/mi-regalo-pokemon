const sonidoBoton = new Audio('assets/snd/CLIC.MP3');
const sonidoCaptura = new Audio('assets/snd/CAPTURA.WAV');

const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/BEAUTIFLY.PNG" 
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

function activarEscaner() {
    // Forzamos el sonido al interactuar
    sonidoBoton.play().catch(() => console.log("Sonido bloqueado"));

    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                actualizarPantalla(pokemonDB[code]);
            }
            html5QrCode.stop();
        }
    ).catch(err => console.error(err));
}

function actualizarPantalla(data) {
    // Intentar sonido de captura
    sonidoCaptura.play().catch(() => console.log("Sonido captura bloqueado"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    // Cambiamos la imagen
    const imgElement = document.getElementById('main-sprite');
    imgElement.src = data.sprite;
    
    // Si la imagen falla (error 404), intentamos cargarla en minúsculas automáticamente
    imgElement.onerror = function() {
        if (this.src.includes('.PNG')) {
            this.src = this.src.replace('.PNG', '.png').toLowerCase();
        }
    };
}
