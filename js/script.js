// SONIDOS
const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = { text: "GENGAR POR PERTO!", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", catchRate: 0.1, cry: "assets/sng/gengar.mp3" };

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
    sprite.classList.remove('is-pokeball', 'is-greatball', 'shaking-hard', 'shaking-slow', 'captured-success');
    
    // Sonido de grito al aparecer
    new Audio(pokemonActualData.cry).play().catch(() => {});
    pokemonDetectado = true;
}

// CAPTURA NORMAL
function capturarNormal() {
    if (!pokemonDetectado || !pokemonActualData) return;
    sonidoBoton.play().catch(() => {});
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    iniciarProcesoCaptura(ballImg, pokemonActualData.catchRate, "¡POKÉ BALL VA!", false);
}

// SUPER BALL (PROBABILIDAD X2 MEJORADA)
function capturarSuper() {
    if (!pokemonDetectado || !pokemonActualData) return;
    sonidoBoton.play().catch(() => {});
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    // Probabilidad doble para la Super Ball
    iniciarProcesoCaptura(ballImg, (pokemonActualData.catchRate * 2), "¡SUPER BALL VA!", true);
}

// FUNCIÓN ÚNICA Y COMPARTIDA PARA LA ANIMACIÓN DE CAPTURA
function iniciarProcesoCaptura(img, prob, msg, esSuper) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const oldImg = sprite.src;
    const oldTxt = texto.innerHTML;

    sprite.src = img;
    sprite.classList.add('is-pokeball');
    if(esSuper) sprite.classList.add('is-greatball'); // Super Ball visual
    sprite.classList.add('shaking-hard');
    texto.innerHTML = msg;

    // Fase 1: Movimiento brusco (1.5s)
    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    // Fase 2: Movimiento suave y resolución (3.5s totales)
    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        if (Math.random() < prob) {
            
            // FASE DE ÉXITO CON DESTELOS DE LUZ COMPARTIDOS
            texto.innerHTML = "¡ATRAPADO!";
            sprite.classList.add('captured-success'); // Activamos los destellos de luz compartidos
            pokemonDetectado = false;
            
            // RESTAURACIÓN AUTOMÁTICA DE LA PANTALLA
            restaurarPantallaAutomaticamente(); 
            
        } else {
            // FASE DE FALLO (Restauramos)
            texto.innerHTML = "¡SE ESCAPÓ!";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball', 'is-greatball');
                sprite.src = oldImg;
                sprite.style.width = "120px";
                texto.innerHTML = oldTxt;
            }, 1500);
        }
    }, 3500);
}

// Función interna para restaurar la pantalla automáticamente
function restaurarPantallaAutomaticamente() {
    setTimeout(() => {
        document.getElementById('pokedex-content').style.display = 'flex';
        document.getElementById('main-text').innerHTML = "BUSCANDO POKÉMON...";
        const sprite = document.getElementById('main-sprite');
        sprite.classList.remove('is-pokeball', 'is-greatball', 'shaking-hard', 'shaking-slow', 'captured-success');
        sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png"; // Limpiar sprite
        sprite.style.width = "120px";
        pokemonDetectado = true;
    }, 4500); // 1s después de que termine la animación (3.5s + 1s)
}
