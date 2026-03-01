const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonDetectado = null; // Guardará el Pokémon que esté en pantalla
let html5QrCode;

const pokemonDB = {
    "GENGAR": { 
        text: "¡GENGAR DETECTADO!<br>LA SOMBRA TRAVIESA", 
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        cry: "assets/sng/gengar.mp3"
    },
    "UMBREON": { 
        text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", 
        sprite: "assets/img/UMBREON.png",
        cry: "assets/sng/umbreon.mp3"
    }
    // ... el resto de tu DB se mantiene igual [cite: 2026-02-27]
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.querySelector('.pokedex').classList.add('scanning');
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 200, height: 200 } }, (decodedText) => {
        let code = decodedText.toUpperCase().trim();
        if (pokemonDB[code]) {
            const data = pokemonDB[code];
            html5QrCode.stop().then(() => { 
                actualizarPantalla(data); 
            });
        }
    }).catch((err) => console.error(err));
}

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = data.sprite;
    sprite.classList.remove('shaking-ball'); // Limpiar por si acaso
    
    pokemonDetectado = data; // Marcamos que hay un Pokémon listo para atrapar [cite: 2026-02-28]

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

// NUEVA FUNCIÓN PARA EL BOTÓN NEGRO
function capturarPokemon() {
    if (!pokemonDetectado) return; // Si no hay Pokémon, no hace nada

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // 1. Cambiamos a la Pokéball pixelada
    sprite.src = 'assets/img/pokeball.png'; 
    
    // 2. Activamos la animación de CSS que ya definimos
    sprite.classList.add('shaking-ball'); 
    
    // 3. Cambiamos el texto para dar tensión
    texto.innerHTML = "¡CAPTURANDO...!";

    // 4. Simulamos los 3 segundos de resistencia
    setTimeout(() => {
        sprite.classList.remove('shaking-ball'); // Para el movimiento
        texto.innerHTML = `¡${pokemonDetectado.text.split('<')[0]}<br>CAPTURADO CON ÉXITO!`;
        pokemonDetectado = null; // Reset para el próximo escaneo
    }, 3000);
}
