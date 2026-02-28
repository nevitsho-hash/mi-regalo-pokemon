const sonidoBoton = new Audio('assets/sng/clic.mp3');

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

function activarEscaner() {
    // Reproducir sonido de clic
    sonidoBoton.play().catch(() => {});
    
    // Iniciar parpadeo de LEDs
    document.querySelector('.pokedex').classList.add('scanning');
    
    // Cambiar vista de pantalla
    document.getElementById('pokedex-content').style.display = 'none';
    const readerElement = document.getElementById('reader');
    readerElement.style.display = 'block';

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    const config = { 
        fps: 10, 
        qrbox: { width: 150, height: 150 }, // Cuadro de escaneo ajustado a la pantalla pequeña
        aspectRatio: 1.0 
    };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                const data = pokemonDB[code];
                html5QrCode.stop().then(() => {
                    actualizarPantalla(data);
                }).catch(err => console.error("Error al detener:", err));
            }
        },
        (errorMessage) => {
            // Error de escaneo silencioso (mientras busca)
        }
    ).catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
        alert("Asegúrate de dar permisos de cámara.");
    });
}

function actualizarPantalla(data) {
    // Detener parpadeo
    document.querySelector('.pokedex').classList.remove('scanning');

    // Restaurar elementos visuales
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;

    // Sonido del Pokémon
    setTimeout(() => {
        const audioGrito = new Audio(data.cry);
        audioGrito.play().catch(e => console.log("Grito no encontrado"));
    }, 300); 
}
