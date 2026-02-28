const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonEnPantalla = false; // Control para saber si se puede capturar

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
    document.getElementById('main-sprite').src = data.sprite;
    
    pokemonEnPantalla = true; // Ahora el botón negro sí hará algo

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

// ESTA ES LA FUNCIÓN QUE SE ACTIVA CON EL BOTÓN NEGRO
function capturarPokemon() {
    if (!pokemonEnPantalla) {
        console.log("No hay pokémon detectado para capturar");
        return;
    }

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // Cambiamos el sprite por tu imagen de la Pokéball
    sprite.src = 'assets/img/pokeball.png';
    sprite.classList.add('shaking-ball'); // Inicia el movimiento
    texto.innerHTML = "CAPTURANDO...";

    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡CAPTURADO CON ÉXITO!";
        pokemonEnPantalla = false;
    }, 3000);
}
