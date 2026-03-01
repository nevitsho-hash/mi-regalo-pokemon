const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonDetectado = true;
let html5QrCode;

const pokemonDB = {
    "GENGAR": { 
        text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", 
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        cry: "assets/sng/gengar.mp3"
    }
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.querySelector('.pokedex').classList.add('scanning');
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 180, height: 180 } }, (decodedText) => {
        let code = decodedText.toUpperCase().trim();
        if (pokemonDB[code]) {
            const data = pokemonDB[code];
            html5QrCode.stop().then(() => { actualizarPantalla(data); });
        }
    }).catch((err) => console.error(err));
}

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
    document.getElementById('main-sprite').classList.remove('shaking-ball');
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300); 
}

function capturarPokemon() {
    if (!pokemonDetectado) return;
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    sprite.src = 'assets/img/pokeball.png'; 
    sprite.classList.add('shaking-ball'); 
    texto.innerHTML = "¡ATRÁPALO!";
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡POKÉMON ATRAPADO!<br>REGISTRADO CON ÉXITO";
        pokemonDetectado = false;
    }, 3000);
}
