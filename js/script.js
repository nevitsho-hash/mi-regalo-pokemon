let html5QrCode;
let pokemonDetectado = true;
// Gengar por defecto al iniciar
let pokemonActualData = { text: "GENGAR POR PERTO!", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", catchRate: 0.1 };

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
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    // Encender LEDs al escanear
    document.querySelectorAll('.led').forEach(l => {
        l.classList.remove('success'); // Limpiar éxitos anteriores
        l.classList.add('animating');
    });

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
    
    // Apagar LEDs
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating', 'success'));
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = pokemonActualData.sprite;
    sprite.style.width = "120px";
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow', 'captured-zoom');
    pokemonDetectado = true;
}

function capturarNormal() {
    if (!pokemonDetectado) return;
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    iniciarProcesoCaptura(ballImg, pokemonActualData.catchRate, "¡POKÉ BALL VA!");
}

function capturarSuper() {
    if (!pokemonDetectado) return;
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    // Probabilidad doble para la Super Ball
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
            
            // FASE DE ÉXITO CON ANIMACIÓN [cite: 2026-03-01]
            texto.innerHTML = "¡ATRAPADO!";
            sprite.classList.add('captured-zoom'); // Activamos el zoom y opacidad
            document.querySelectorAll('.led').forEach(l => l.classList.add('success')); // LEDs en verde
            pokemonDetectado = false;
            
        } else {
            // FASE DE FALLO (Restauramos)
            texto.innerHTML = "¡SE ESCAPÓ!";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = pokeImgAnterior;
                sprite.style.width = "120px";
                texto.innerHTML = pokeTxtAnterior;
            }, 1500);
        }
    }, 3500);
}
