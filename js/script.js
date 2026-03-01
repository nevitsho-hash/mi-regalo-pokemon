const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = null; // Variable para guardar los datos del Pokémon en pantalla

const pokemonDB = {
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!", sprite: "assets/img/BEAUTIFLY.png", cry: "assets/sng/beautifly.mp3", catchRate: 0.5 }, // 50% éxito
    "SNORLAX": { text: "¡HAS ENCONTRADO A SNORLAX!", sprite: "assets/img/SNORLAX.png", cry: "assets/sng/snorlax.mp3", catchRate: 0.2 }, // 20% éxito (Difícil)
    "SWALOT": { text: "¡HAS ENCONTRADO A SWALOT!", sprite: "assets/img/SWALOT.png", cry: "assets/sng/swalot.mp3", catchRate: 0.4 }, 
    "TOTODILE": { text: "¡HAS ENCONTRADO A TOTODILE!", sprite: "assets/img/TOTODILE.png", cry: "assets/sng/totodile.mp3", catchRate: 0.6 }, // 60% éxito (Fácil)
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3", catchRate: 0.3 },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO A JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", cry: "assets/sng/jigglypuff.mp3", catchRate: 0.7 }, // Muy fácil
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!", sprite: "assets/img/GENGAR.png", cry: "assets/sng/gengar.mp3", catchRate: 0.1 } // 10% éxito (Legendario/Muy difícil)
};

function activarEscaner() {
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.querySelectorAll('.led').forEach(l => l.classList.add('animating'));

    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 250, height: 200 } }, (text) => {
        let code = text.toUpperCase().trim();
        if (pokemonDB[code]) {
            html5QrCode.stop().then(() => { 
                pokemonActualData = pokemonDB[code]; // Guardamos la info del Pokémon capturado
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
    sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow');
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300);
}

function capturarPokemon() {
    if (!pokemonDetectado || !pokemonActualData) return;
    
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const originalSprite = sprite.src;
    const originalText = texto.innerHTML;

    sprite.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = "¡ATRÁPALO...!";

    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        
        // Lógica de probabilidad personalizada [cite: 2026-03-01]
        // Comparamos el número aleatorio contra el catchRate del Pokémon actual
        const exito = Math.random() < pokemonActualData.catchRate; 

        if (exito) {
            texto.innerHTML = "¡POKÉMON ATRAPADO!";
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡OH NO! SE ESCAPÓ";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = originalSprite;
                sprite.style.width = "120px";
                texto.innerHTML = originalText;
            }, 1500);
        }
    }, 3500);
}
