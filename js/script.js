// Configuración de audios base [cite: 2026-03-01]
const sonidoBoton = new Audio('assets/sng/clic.mp3');

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
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", cry: "assets/sng/beautifly.mp3", catchRate: 0.5 },
    "SNORLAX": { text: "¡HAS ENCONTRADO A SNORLAX!", sprite: "assets/img/SNORLAX.png", cry: "assets/sng/snorlax.mp3", catchRate: 0.2 },
    "SWALOT": { text: "¡HAS ENCONTRADO A SWALOT!", sprite: "assets/img/SWALOT.png", cry: "assets/sng/swalot.mp3", catchRate: 0.4 },
    "TOTODILE": { text: "¡HAS ENCONTRADO A TOTODILE!", sprite: "assets/img/TOTODILE.png", cry: "assets/sng/totodile.mp3", catchRate: 0.6 },
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3", catchRate: 0.3 },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO A JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", cry: "assets/sng/jigglypuff.mp3", catchRate: 0.7 },
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!", sprite: "assets/img/GENGAR.png", cry: "assets/sng/gengar.mp3", catchRate: 0.1 }
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
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow', 'captured-zoom');
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300);
}

// CAPTURA NORMAL
function capturarPokemon() {
    if (!pokemonDetectado || !pokemonActualData) return;
    const probNormal = pokemonActualData.catchRate;
    const msgNormal = "¡POKÉ BALL VA!";
    const imgNormal = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    iniciarProcesoCaptura(imgNormal, probNormal, msgNormal);
}

// SUPER BALL (PROBABILIDAD X2 MEJORADA)
function usarSuperBall() {
    if (!pokemonDetectado || !pokemonActualData) return;
    // Super Ball multiplica la probabilidad por 2 [cite: 2026-03-01]
    const probMejorada = Math.min(pokemonActualData.catchRate * 2, 0.95); 
    const msgSuper = "¡SUPER BALL VA!";
    const imgSuper = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    iniciarProcesoCaptura(imgSuper, probMejorada, msgSuper);
}

// FUNCIÓN ÚNICA Y COMPARTIDA PARA LA ANIMACIÓN DE CAPTURA [cite: 2026-03-01]
function iniciarProcesoCaptura(img, prob, msg) {
    sonidoBoton.play().catch(() => {}); // Sonido al lanzar

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const imgAnterior = sprite.src;
    const txtAnterior = texto.innerHTML;

    sprite.src = img;
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = msg;

    // Fase 1: Movimiento brusco (1.5s)
    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    // Fase 2: Movimiento suave y resolución (3.5s totales)
    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        const exito = Math.random() < prob;

        if (exito) {
            texto.innerHTML = "¡ATRAPADO!";
            sprite.classList.add('captured-zoom'); // Activamos la nueva animación compartida [cite: 2026-03-01]
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡OH NO! SE ESCAPÓ";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = imgAnterior;
                sprite.style.width = "120px";
                texto.innerHTML = txtAnterior;
            }, 1500);
        }
    }, 3500);
}
