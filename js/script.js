// CORRECCIÓN: Cambiado 'snd' por 'sng' para que coincida con tu carpeta real
const sonidoBoton = new Audio('./assets/sng/clic.mp3');
const sonidoCaptura = new Audio('./assets/sng/captura.wav');

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

// ... el resto de las funciones activarEscaner() y actualizarPantalla() se mantienen igual ...

function actualizarPantalla(data) {
    sonidoCaptura.play().catch(e => console.log("Error sonido:", e));
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
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
