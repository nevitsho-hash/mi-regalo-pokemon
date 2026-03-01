// SONIDOS [cite: 2026-02-27]
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

async function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    
    // 1. Limpieza total de instancias previas para evitar bloqueos de cámara [cite: 2026-03-01]
    if (html5QrCode) {
        try { await html5QrCode.stop(); } catch (e) {}
        html5QrCode = null;
    }

    // 2. Preparar interfaz
    document.getElementById('pokedex-content').style.display = 'none';
    const readerDiv = document.getElementById('reader');
    readerDiv.style.display = 'block';
    document.querySelectorAll('.led').forEach(l => l.classList.add('animating'));

    // 3. RETRASO CRÍTICO: Esperamos a que el DOM procese el cambio de display [cite: 2026-03-01]
    setTimeout(() => {
        html5QrCode = new Html5Qrcode("reader");
        const config = { 
            fps: 15, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0 
        };

        html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            (text) => {
                let code = text.toUpperCase().trim();
                if (pokemonDB[code]) {
                    html5QrCode.stop().then(() => {
                        pokemonActualData = pokemonDB[code];
                        actualizarPantalla();
                    });
                }
            }
        ).catch(err => {
            console.error("Error cámara:", err);
            // Si falla, avisamos al usuario en la pantalla de la Pokédex
            document.getElementById('main-text').innerHTML = "ERROR DE CÁMARA";
            actualizarPantalla();
        });
    }, 300); // 300ms son suficientes para que el div sea "visible" para el script
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
            sprite.classList.add('captured-success');
            document.querySelectorAll('.led').forEach(l => l.classList.add('success'));
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡SE ESCAPÓ!";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = oldImg;
                sprite.style.width = "120px";
                texto.innerHTML = oldTxt;
            }, 1500);
        }
    }, 3500);
}
