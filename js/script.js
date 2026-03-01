const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = { text: "GENGAR POR PERTO!", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", catchRate: 0.1, cry: "assets/sng/gengar.mp3" };

const pokemonDB = {
    "BEAUTIFLY": { text: "¡BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", catchRate: 0.5, cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡SNORLAX!", sprite: "assets/img/SNORLAX.png", catchRate: 0.2, cry: "assets/sng/snorlax.mp3" },
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
    const oldImg = sprite.src;
    const oldTxt = texto.innerHTML;

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
            sprite.classList.add('captured-success'); // Brillo temporal
            document.querySelectorAll('.led').forEach(l => l.classList.add('success'));
            pokemonDetectado = false;
        } else {
            // LÓGICA DE ESCAPE REINTEGRADA
            texto.innerHTML = "¡SE ESCAPÓ!";
            
            // Reintroducimos el zoom y encogimiento
            sprite.style.transform = "scale(0.5)"; // Zoom/Encogimiento

            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.style.transform = "scale(1)"; // Restauramos zoom
                sprite.src = oldImg;
                sprite.style.width = "120px";
                texto.innerHTML = oldTxt;
            }, 1000);
        }
    }, 3500);
}
