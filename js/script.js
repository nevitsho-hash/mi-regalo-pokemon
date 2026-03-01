const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;

const pokemonDB = {
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS", sprite: "assets/img/BEAUTIFLY.png", cry: "assets/sng/beautifly.mp3" },
    "SNORLAX": { text: "¡HAS ENCONTRADO A SNORLAX!", sprite: "assets/img/SNORLAX.png", cry: "assets/sng/snorlax.mp3" },
    "SWALOT": { text: "¡HAS ENCONTRADO A SWALOT!", sprite: "assets/img/SWALOT.png", cry: "assets/sng/swalot.mp3" },
    "TOTODILE": { text: "¡HAS ENCONTRADO A TOTODILE!", sprite: "assets/img/TOTODILE.png", cry: "assets/sng/totodile.mp3" },
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3" },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO A JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", cry: "assets/sng/jigglypuff.mp3" },
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!<br>LA SOMBRA TRAVIESA", sprite: "assets/img/GENGAR.png", cry: "assets/sng/gengar.mp3" }
};

function activarEscaner() {
    console.log("Activando escáner...");
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.querySelectorAll('.led').forEach(l => l.classList.add('animating'));

    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: { width: 250, height: 200 } }, (text) => {
        let code = text.toUpperCase().trim();
        if (pokemonDB[code]) {
            html5QrCode.stop().then(() => { actualizarPantalla(pokemonDB[code]); });
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
    if (!pokemonDetectado) return;
    
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const pokemonActual = sprite.src;
    const textoActual = texto.innerHTML;

    // FASE 1: Movimiento brusco
    sprite.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = "¡ATRÁPALO...!";

    // FASE 2: Baja intensidad (a los 1.5s)
    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    // FASE 3: Resolución de dificultad aumentada [cite: 2026-03-01]
    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        
        // MODIFICACIÓN DE DIFICULTAD: 
        // Math.random() > 0.8 significa que el Pokémon escapará el 80% de las veces.
        const exito = Math.random() > 0.8; 

        if (exito) {
            texto.innerHTML = "¡POKÉMON ATRAPADO!";
            pokemonDetectado = false;
        } else {
            texto.innerHTML = "¡OH NO! SE ESCAPÓ";
            setTimeout(() => {
                sprite.classList.remove('is-pokeball');
                sprite.src = pokemonActual;
                sprite.style.width = "120px";
                texto.innerHTML = textoActual;
            }, 1500);
        }
    }, 3500);
}
