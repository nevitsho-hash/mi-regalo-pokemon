const sonidoBoton = new Audio('assets/sng/clic.mp3');
let html5QrCode;
let pokemonDetectado = true;
let pokemonActualData = null; // Almacena los datos del Pokémon que está en pantalla

// BASE DE DATOS CON CATCH RATE PERSONALIZADO
const pokemonDB = {
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS", sprite: "assets/img/BEAUTIFLY.png", cry: "assets/sng/beautifly.mp3", catchRate: 0.5 },
    "SNORLAX": { text: "¡HAS ENCONTRADO A SNORLAX!", sprite: "assets/img/SNORLAX.png", cry: "assets/sng/snorlax.mp3", catchRate: 0.2 },
    "SWALOT": { text: "¡HAS ENCONTRADO A SWALOT!", sprite: "assets/img/SWALOT.png", cry: "assets/sng/swalot.mp3", catchRate: 0.4 },
    "TOTODILE": { text: "¡HAS ENCONTRADO A TOTODILE!", sprite: "assets/img/TOTODILE.png", cry: "assets/sng/totodile.mp3", catchRate: 0.6 },
    "UMBREON": { text: "¡HAS ENCONTRADO A UMBREON!", sprite: "assets/img/UMBREON.png", cry: "assets/sng/umbreon.mp3", catchRate: 0.3 },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO A JIGGLYPUFF!", sprite: "assets/img/JIGGLYPUFF.png", cry: "assets/sng/jigglypuff.mp3", catchRate: 0.7 },
    "GENGAR": { text: "¡HAS ENCONTRADO A GENGAR!<br>LA SOMBRA TRAVIESA", sprite: "assets/img/GENGAR.png", cry: "assets/sng/gengar.mp3", catchRate: 0.1 }
};

function activarEscaner() {
    console.log("Sistema: Iniciando escáner...");
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    // Encender animación de LEDs
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
    document.getElementById('main-text
