const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;

const pokemonDB = {
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS", sprite: "assets/img/BEAUTIFLY.png", cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡HAS ENCONTRADO A SNORLAX!", sprite: "assets/img/SNORLAX.png", cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡HAS ENCONTRADO A SWALOT!", sprite: "assets/img/SWALOT.png", cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡HAS ENCONTRADO A TOTODILE!", sprite: "assets/img/TOTODILE.png", cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO A JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!", sprite: "assets/img/GENGAR.png", cry: "assets/sng/gengar.mp3" }
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 250, height: 200 } }, (text) => {
        let code = text.toUpperCase().trim();
        if (pokemonDB[code]) {
            html5QrCode.stop().then(() => { actualizarPantalla(pokemonDB[code]); });
        }
    }).catch(err => console.error(err));
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
    sprite.src = 'assets/img/pokeball.png'; 
    sprite.classList.add('shaking-ball'); 
    document.getElementById('main-text').innerHTML = "¡ATRÁPALO!";
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        document.getElementById('main-text').innerHTML = "¡POKÉMON ATRAPADO!";
        pokemonDetectado = false;
    }, 3000);
}
