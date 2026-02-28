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
    
    // 1. Detener cualquier instancia previa de forma segura
    try {
        if (html5QrCode) {
            await html5QrCode.stop();
            html5QrCode = null; // Forzar limpieza
        }
    } catch (e) {
        console.log("Cámara ya estaba detenida");
    }

    // 2. Preparar la interfaz
    document.querySelector('.pokedex').classList.add('scanning');
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    // 3. Crear nueva instancia limpia
    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 15, qrbox: { width: 220, height: 220 } };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        async (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                const data = pokemonDB[code];
                await html5QrCode.stop(); // Detenemos antes de mostrar resultados
                actualizarPantalla(data);
            }
        }
    ).catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
        document.getElementById('reader').innerHTML = "<p style='color:white; padding:20px;'>ERROR DE CÁMARA. RECARGA LA PÁGINA.</p>";
    });
}

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    
    const sprite = document.getElementById('main-sprite');
    document.getElementById('main-text').innerHTML = data.text;
    sprite.src = data.sprite;
    
    // Reset de estilos para permitir nueva captura
    sprite.classList.remove('shaking-ball');
    sprite.style.transform = "none";
    
    pokemonEnPantalla = true; 

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

function capturarPokemon() {
    if (!pokemonEnPantalla) return;

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // Cambiar a tu imagen de pokeball
    sprite.src = 'assets/img/pokeball.png'; 
    sprite.classList.add('shaking-ball'); 
    texto.innerHTML = "¡ATRÁPALO!";

    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡CAPTURADO CON ÉXITO!";
        pokemonEnPantalla = false; 
    }, 3000);
}
