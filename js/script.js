const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = { text: "GENGAR", sprite: "assets/img/GENGAR.png", catchRate: 0.1 };

const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5 },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.2 },
    "SWALOT": { text: "¡SWALOT!", sprite: "assets/img/SWALOT.png", catchRate: 0.4 },
    "TOTODILE": { text: "¡TOTODILE!", sprite: "assets/img/TOTODILE.png", catchRate: 0.6 },
    "UMBREON": { text: "¡UMBREON!", sprite: "assets/img/UMBREON.png", catchRate: 0.3 },
    "JIGGLYPUFF": { text: "¡JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", catchRate: 0.7 },
    "GENGAR": { text: "¡GENGAR!", sprite: "assets/img/GENGAR.png", catchRate: 0.1 }
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.querySelectorAll('.led').forEach(l => l.classList.add('animating'));
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 250, height: 200 } }, (text) => {
        let code = text.toUpperCase().trim();
        if (pokemonDB[code]) {
            html5QrCode.stop().then(() => { 
                pokemonActualData = pokemonDB[code];
                actualizarPantalla(pokemonActualData); 
            });
        }
    }).catch(err => console.error(err));
}

function actualizarPantalla(data) {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating'));
    const sprite = document.getElementById('main-sprite');
    sprite.src = data.sprite;
    sprite.style.width = "120px"; 
    sprite.classList.remove('is-pokeball', 'is-superball', 'shaking-hard', 'shaking-slow');
    pokemonDetectado = true;
}

function capturarPokemon() {
    if (!pokemonDetectado) return;
    const prob = pokemonActualData.catchRate;
    ejecutarCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', prob, false);
}

function usarSuperBall() {
    if (!pokemonDetectado) return;
    const prob = pokemonActualData.catchRate * 2; // Doble probabilidad
    ejecutarCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', prob, true);
}

function ejecutarCaptura(img, prob, esSuper) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const pokeImg = sprite.src;
    const pokeTxt = texto.innerHTML;

    sprite.src = img;
    sprite.classList.add('is-pokeball');
    if(esSuper) sprite.classList.add('is-superball');
    sprite.classList.add('shaking-hard');
    texto.innerHTML = esSuper ? "¡SUPER BALL VA!" : "¡POKÉ BALL VA!";

    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        if (Math.random() < prob) {
            texto.innerHTML = "¡ATRAPADO!";
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡SE ESCAPÓ!";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball', 'is-superball');
                sprite.src = pokeImg;
                sprite.style.width = "120px";
                texto.innerHTML = pokeTxt;
            }, 1500);
        }
    }, 3500);
}
