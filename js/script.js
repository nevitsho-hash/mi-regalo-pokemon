const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonEnPantalla = false; 
let html5QrCode = null;

const pokemonDB = {
    "GENGAR": { 
        text: "¡GENGAR DETECTADO!<br>LA SOMBRA TRAVIESA", 
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        cry: "assets/sng/gengar.mp3"
    }
};

async function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    
    // 1. Limpieza de estado previo
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
    }
    
    document.querySelector('.pokedex').classList.add('scanning');
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    // 2. Reiniciar el objeto de la cámara
    if (!html5QrCode) { 
        html5QrCode = new Html5Qrcode("reader"); 
    }
    
    const config = { fps: 15, qrbox: { width: 200, height: 200 } };
    
    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        let code = decodedText.toUpperCase().trim();
        if (pokemonDB[code]) {
            const data = pokemonDB[code];
            html5QrCode.stop().then(() => { 
                actualizarPantalla(data); 
            }).catch(err => console.error("Error al detener cámara", err));
        }
    }).catch((err) => {
        console.error("Error al iniciar cámara", err);
        alert("Asegúrate de dar permisos de cámara");
    });
}

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    
    const sprite = document.getElementById('main-sprite');
    document.getElementById('main-text').innerHTML = data.text;
    sprite.src = data.sprite;
    
    // Limpiar efectos visuales de capturas anteriores
    sprite.classList.remove('shaking-ball');
    sprite.style.transform = "rotate(0deg) translate(0,0)";
    
    pokemonEnPantalla = true; 

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

function capturarPokemon() {
    if (!pokemonEnPantalla) return;

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    sprite.src = 'assets/img/pokeball.png'; // [cite: 2026-02-28]
    sprite.classList.add('shaking-ball'); 
    texto.innerHTML = "¡CAPTURANDO...!";

    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡POKÉMON ATRAPADO!";
        pokemonEnPantalla = false; 
    }, 3000);
}
