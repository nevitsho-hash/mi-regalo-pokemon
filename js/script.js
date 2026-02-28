// SONIDOS (Asegúrate de que los nombres coincidan en assets/sng/)
const sonidoClic = new Audio('assets/sng/clic.mp3');
const sonidoCaptura = new Audio('assets/sng/shaking.mp3'); 

let pokemonDetectado = null;

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
    document.getElementById('main-sprite').classList.remove('pokeball-capture', 'shaking-ball');
    
    pokemonDetectado = data;

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

// FUNCIÓN DEL BOTÓN NEGRO: CAPTURA
function capturarPokemon() {
    if (!pokemonDetectado) return;

    sonidoClic.play();
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // 1. El Pokémon entra en la Pokéball
    texto.innerHTML = "¡ATRÁPALO!";
    sprite.src = 'assets/img/pokeball.png'; // Tu nueva imagen
    sprite.classList.add('pokeball-capture', 'shaking-ball');

    // 2. Simulamos la resistencia
    sonidoCaptura.loop = true;
    sonidoCaptura.play().catch(() => {});

    setTimeout(() => {
        // 3. Captura exitosa
        sprite.classList.remove('shaking-ball');
        sonidoCaptura.pause();
        sonidoCaptura.currentTime = 0;
        
        texto.innerHTML = "¡CAPTURADO!<br>REGISTRADO EN TU PC";
        new Audio('assets/sng/capture-success.mp3').play().catch(() => {});
        
        pokemonDetectado = null; // Reset
    }, 3000); // 3 segundos de tensión
}

/* ... Resto de funciones (activarEscaner, etc) ... */
