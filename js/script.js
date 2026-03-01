const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
// Gengar como estado inicial con tu frase personalizada [cite: 2026-03-01]
let pokemonActualData = { 
    text: "UM SENTIMENTO<br>ESTRANHO...<br>GENGAR POR PERTO!", 
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", 
    catchRate: 0.1, 
    cry: "assets/sng/gengar.mp3" 
};

// RESTAURACIÓN TOTAL DE LA BASE DE DATOS [cite: 2026-03-01]
const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5, cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.2, cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡SWALOT!", sprite: "assets/img/SWALOT.png", catchRate: 0.4, cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡TOTODILE!", sprite: "assets/img/TOTODILE.png", catchRate: 0.6, cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡UMBREON!", sprite: "assets/img/UMBREON.png", catchRate: 0.3, cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", catchRate: 0.7, cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡GENGAR!", sprite: "assets/img/GENGAR.png", catchRate: 0.1, cry: "assets/sng/gengar.mp3" }
};

window.addEventListener('DOMContentLoaded', () => {
    html5QrCode = new Html5Qrcode("reader");
});

async function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.querySelectorAll('.led').forEach(l => {
        l.classList.remove('success');
        l.classList.add('animating');
    });

    try {
        await html5QrCode.start({ facingMode: "environment" }, { fps: 20, qrbox: 250 }, (text) => {
            let code = text.toUpperCase().trim();
            if (pokemonDB[code]) {
                html5QrCode.stop().then(() => {
                    pokemonActualData = pokemonDB[code];
                    actualizarPantalla();
                });
            }
        });
    } catch (err) { restaurarInterfaz(); }
}

function actualizarPantalla() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = pokemonActualData.text;
    document.querySelectorAll('.led').forEach(l => l.classList.remove('animating', 'success'));
    const sprite = document.getElementById('main-sprite');
    sprite.src = pokemonActualData.sprite;
    sprite.style.width = "120px";
    sprite.style.transform = "scale(1)";
    sprite.style.filter = "none";
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow', 'captured-success');
    new Audio(pokemonActualData.cry).play().catch(() => {});
    pokemonDetectado = true;
}

function restaurarInterfaz() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
}

function capturarNormal() {
    if (!pokemonDetectado) return;
    sonidoBoton.play().catch(() => {});
    iniciarCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', pokemonActualData.catchRate, "¡POKÉ BALL!");
}

function capturarSuper() {
    if (!pokemonDetectado) return;
    sonidoBoton.play().catch(() => {});
    iniciarCaptura('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', (pokemonActualData.catchRate * 2), "¡SUPER BALL!");
}

function iniciarCaptura(img, prob, msg) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const pokemonSpriteURL = pokemonActualData.sprite; 
    const fraseGengar = "UM SENTIMENTO<br>ESTRANHO...<br>GENGAR POR PERTO!";

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
            sprite.classList.add('captured-success');
            document.querySelectorAll('.led').forEach(l => l.classList.add('success'));
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡SE ESCAPÓ!";
            
            // Animación de escape natural [cite: 2026-03-01]
            sprite.style.transition = "transform 0.8s ease, filter 0.5s ease";
            sprite.style.transform = "scale(0.4)"; 

            // Destello al abrirse la bola
            setTimeout(() => {
                sprite.style.filter = "brightness(2.5) contrast(1.2)";
            }, 400);

            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = pokemonSpriteURL;
                sprite.style.transform = "scale(1.2)"; // El Pokémon "salta" fuera
                sprite.style.filter = "none";
                
                // Retorno al estado inicial tras ver al Pokémon escapar
                setTimeout(() => {
                    sprite.style.transform = "scale(1)";
                    sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png";
                    texto.innerHTML = fraseGengar;
                    sprite.style.width = "120px";
                }, 1200);
            }, 800);
        }
    }, 3500);
}
