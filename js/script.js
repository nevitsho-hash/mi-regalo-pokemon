// Configuración de audios base [cite: 2026-02-27]
const sonidoBoton = new Audio('assets/sng/clic.mp3');
const sonidoCapturaOk = new Audio('assets/sng/captura_ok.mp3'); // Opcional, si lo tienes
const sonidoFallo = new Audio('assets/sng/escape.mp3'); // Opcional, si lo tienes

let html5QrCode;
let pokemonDetectado = true;
// Gengar por defecto al iniciar
let pokemonActualData = { 
    text: "GENGAR POR PERTO!", 
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", 
    catchRate: 0.1,
    cry: "assets/sng/gengar.mp3" 
};

const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5, cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.2, cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡SWALOT!", sprite: "assets/img/SWALOT.png", catchRate: 0.4, cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡TOTODILE!", sprite: "assets/img/TOTODILE.png", catchRate: 0.6, cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡UMBREON!", sprite: "assets/img/UMBREON.png", catchRate: 0.3, cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", catchRate: 0.7, cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡GENGAR!", sprite: "assets/img/GENGAR.png", catchRate: 0.1, cry: "assets/sng/gengar.mp3" }
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {}); // Sonido al pulsar botón verde
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.querySelectorAll('.led').forEach(l => l.classList.add('animating'));

    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: 250 }, (text) => {
        let code = text.toUpperCase().trim();
        if (pokemonDB[code]) {
            html5QrCode.stop().then(() => { 
                pokemonActualData = pokemonDB[code];
                actualizarPantalla(); 
            });
        }
    }).catch(err => console.error(err));
}

function actualizarPantalla() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = pokemonActualData.text;
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating'));
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = pokemonActualData.sprite;
    sprite.style.width = "120px";
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow');
    
    pokemonDetectado = true;

    // Reproducir el grito del Pokémon encontrado [cite: 2026-03-01]
    if (pokemonActualData.cry) {
        setTimeout(() => {
            new Audio(pokemonActualData.cry).play().catch(e => console.log("Audio bloqueado:", e));
        }, 500);
    }
}

function capturarNormal() {
    if (!pokemonDetectado) return;
    sonidoBoton.play().catch(() => {});
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    iniciarProcesoCaptura(ballImg, pokemonActualData.catchRate, "¡POKÉ BALL VA!");
}

function capturarSuper() {
    if (!pokemonDetectado) return;
    sonidoBoton.play().catch(() => {});
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    iniciarProcesoCaptura(ballImg, (pokemonActualData.catchRate * 2), "¡SUPER BALL VA!");
}

function iniciarProcesoCaptura(img, prob, msg) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const pokeImgAnterior = sprite.src;
    const pokeTxtAnterior = texto.innerHTML;

    sprite.src = img;
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = msg;

    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        if (Math.random() < prob) {
            texto.innerHTML = "¡ATRAPADO!";
            pokemonDetectado = false;
            sonidoCapturaOk.play().catch(() => {});
        } else {
            texto.innerHTML = "¡SE ESCAPÓ!";
            sonidoFallo.play().catch(() => {});
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = pokeImgAnterior;
                sprite.style.width = "120px";
                texto.innerHTML = pokeTxtAnterior;
            }, 1500);
        }
    }, 3500);
}
