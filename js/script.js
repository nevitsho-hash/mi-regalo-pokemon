// SONIDOS DE CAPTURA (Añádelos a assets/sng/)
const sonidoShaking = new Audio('assets/sng/shaking.mp3'); // Sonido de temblor (loop)
const sonidoExito = new Audio('assets/sng/capture-success.mp3'); // Sonido de éxito final

let pokemonEnPantalla = false; // Variable para saber si podemos capturar

// Modificamos tu función para guardar el estado
function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;

    pokemonEnPantalla = true; // El Pokémon está listo para ser capturado

    setTimeout(() => {
        const audioGrito = new Audio(data.cry);
        audioGrito.play().catch(e => console.log("Grito no encontrado"));
    }, 300); 
}

// NUEVA FUNCIÓN PARA EL BOTÓN NEGRO
function capturarPokemon() {
    if (!pokemonEnPantalla) {
        alert("¡No hay ningún Pokémon para capturar!");
        return;
    }

    pokemonEnPantalla = false; // Bloqueamos nuevas capturas inmediatamente

    // 1. REEMPLAZAMOS EL SPRITE POR LA POKÉBALL
    const sprite = document.getElementById('main-sprite');
    sprite.src = 'assets/img/pokeball.png'; // RUTA CORREGIDA
    sprite.classList.add('shaking-ball'); // AÑADIMOS ANIMACIÓN CSS

    // 2. REEMPLAZAMOS EL TEXTO
    document.getElementById('main-text').innerHTML = "CAPTURANDO...";

    // 3. REPRODUCIMOS SONIDO SHAKING (en loop)
    sonidoShaking.loop = true;
    sonidoShaking.play().catch(() => {});

    // 4. TRAS 3 SEGUNDOS (SIMULANDO RESISTENCIA)
    setTimeout(() => {
        sprite.classList.remove('shaking-ball'); // PARAR MOVIMIENTO
        sonidoShaking.pause(); // PARAR SONIDO SHAKING
        sonidoShaking.currentTime = 0; // REINICIAR SONIDO
        
        // 5. SONIDO DE ÉXITO Y TEXTO FINAL
        sonidoExito.play().catch(() => {});
        document.getElementById('main-text').innerHTML = "¡GENGAR DETECTADO!<br>CAPTURADO CON ÉXITO";
    }, 3000); // 3 segundos de "resistencia"
}

// ... (Resto de tu función activarEscaner igual que en Java6) ...
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const pokemonDB = {
    "GENGAR": { 
        text: "¡GENGAR DETECTADO!<br>LA SOMBRA TRAVIESA", 
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        cry: "assets/sng/gengar.mp3"
    }
};
let html5QrCode;
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
            html5QrCode.stop().then(() => { actualizarPantalla(data); });
        }
    }).catch((err) => console.error(err));
}
