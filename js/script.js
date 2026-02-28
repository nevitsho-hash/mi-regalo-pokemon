// 1. Sonidos (Rutas corregidas a tu carpeta assets/sng/)
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/captura.wav');

// 2. Base de datos (Rutas corregidas incluyendo la subcarpeta /img/)
const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", 
        sprite: "assets/img/BEAUTIFLY.png" 
    },
    "SNORLAX": { 
        text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>BLOQUEA EL CAMINO,<br>PERO NO A MI CORAZON", 
        sprite: "assets/img/SNORLAX.png"
        cry: "assets/sng/snorlax.mp3" //
    },
    "SWALOT": { 
        text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", 
        sprite: "assets/img/SWALOT.png"
        cry: "assets/sng/swalot.mp3" //
    },
    "TOTODILE": { 
        text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", 
        sprite: "assets/img/TOTODILE.png" 
        cry: "assets/sng/totodile.mp3" //
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/UMBREON.png"
        cry: "assets/sng/umbreon.mp3" //
    },
    "JIGGLYPUFF": { 
        text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", 
        sprite: "assets/img/JIGGLYPUFF.png"
        cry: "assets/sng/jigglypuff.mp3" //
    },
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "assets/img/GENGAR.png" // Esta es la versión nítida de tu carpeta
        cry: "assets/sng/gengar.mp3" //
    }
};

let html5QrCode;

function activarEscaner() {
    sonidoBoton.play().catch(() => console.log("Audio clic listo"));

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
    ).catch((err) => console.error(err));
}

function actualizarPantalla(data) {
    // 1. Creamos el objeto de sonido específico del Pokémon
    const gritoPokemon = new Audio(data.cry);
    
    // 2. Lo reproducimos
    gritoPokemon.play().catch(() => console.log("El audio no pudo reproducirse"));

    // 3. El resto del código se queda igual
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const imgElement = document.getElementById('main-sprite');
    imgElement.src = data.sprite;
}
