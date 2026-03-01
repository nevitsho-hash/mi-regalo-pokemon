const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = null;

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
    sprite.classList.remove('is-pokeball', 'is-superball', 'shaking-hard', 'shaking-slow');
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300);
}

function capturarPokemon() {
    if (!pokemonDetectado || !pokemonActualData) return;
    ejecutarAnimacionCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', pokemonActualData.catchRate, "¡POKÉ BALL VA!", false);
}

function usarSuperBall() {
    console.log("Botón Azul pulsado: Usando Super Ball"); // Verificación
    if (!pokemonDetectado || !pokemonActualData) return;
    // Probabilidad doble (catchRate * 2)
    ejecutarAnimacionCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', (pokemonActualData.catchRate * 2), "¡SUPER BALL VA!", true);
}

// Función interna para evitar repetir código y errores
function ejecutarAnimacionCaptura(imgBall, probabilidad, mensajeInicial, esSuperBall) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const pokemonActualImg = sprite.src;
    const textoActualMsg = texto.innerHTML;

    sprite.src = imgBall;
    sprite.classList.add('is-pokeball');
    if (esSuperBall) sprite.classList.add('is-superball');
    sprite.classList.add('shaking-hard');
    texto.innerHTML = mensajeInicial;

    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        const exito = Math.random() < probabilidad;
        if (exito) {
            texto.innerHTML = esSuperBall ? "¡CAPTURADO CON SUPER BALL!" : "¡POKÉMON ATRAPADO!";
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡OH NO! SE ESCAPÓ";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball', 'is-superball');
                sprite.src = pokemonActualImg;
                sprite.style.width = "120px";
                texto.innerHTML = textoActualMsg;
            }, 1500);
        }
    }, 3500);
}
