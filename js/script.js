const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonDetectado = true;
let html5QrCode;

const pokemonDB = {
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", cry: "assets/sng/gengar.mp3" },
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3" }
    // Añade aquí el resto de tus Pokémon...
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: 200 }, (decodedText) => {
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
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300); 
}

function capturarPokemon() {
    if (!pokemonDetectado) return;
    const sprite = document.getElementById('main-sprite');
    sprite.src = 'assets/img/pokeball.png'; // Tu imagen pixelada [cite: 2026-02-28]
    sprite.classList.add('shaking-ball'); 
    document.getElementById('main-text').innerHTML = "¡ATRÁPALO!";
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        document.getElementById('main-text').innerHTML = "¡ATRÁPADO CON ÉXITO!";
        pokemonDetectado = false;
    }, 3000);
}
