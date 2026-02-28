// Añadimos el sonido de captura (asegúrate de tener el archivo en assets/sng/)
const sonidoCaptura = new Audio('assets/sng/capture.mp3'); 
let pokemonActual = null; // Variable para saber qué hay en pantalla

// Modificamos tu función de actualización para guardar el pokemon actual
function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
    
    pokemonActual = data; // Guardamos la referencia para poder capturarlo

    setTimeout(() => {
        const audioGrito = new Audio(data.cry);
        audioGrito.play().catch(e => console.log("Grito no encontrado"));
    }, 300); 
}

// Nueva función para el botón negro
function capturarPokemon() {
    if (!pokemonActual) {
        alert("¡No hay ningún Pokémon para capturar!");
        return;
    }

    // Efecto visual en la pantalla
    const pantalla = document.querySelector('.screen-black');
    pantalla.classList.add('capturing');
    
    // Sonido de Pokéball
    sonidoCaptura.play().catch(() => {});

    // Animación del sprite
    document.getElementById('main-sprite').style.transform = "scale(0)";
    document.getElementById('main-sprite').style.transition = "all 0.5s ease-in";

    setTimeout(() => {
        pantalla.classList.remove('capturing');
        document.getElementById('main-text').innerHTML = `¡${pokemonActual.text.split('<')[0]} CAPTURADO!<br>AÑADIDO AL PC.`;
        pokemonActual = null; // Limpiamos para la siguiente captura
    }, 500);
}

// ... (Resto de tu función activarEscaner igual) ...
