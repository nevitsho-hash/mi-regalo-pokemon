const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonDetectado = false; // Control de estado
let html5QrCode;

const pokemonDB = {
    "GENGAR": { 
        text: "¡GENGAR DETECTADO!<br>LA SOMBRA TRAVIESA", 
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        cry: "assets/sng/gengar.mp3"
    },
    // Puedes añadir aquí el resto de tus Pokémon
};

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.querySelector('.pokedex').classList.add('scanning');
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    
    if (!html5QrCode) { 
        html5QrCode = new Html5Qrcode("reader"); 
    }
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 15, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                const data = pokemonDB[code];
                html5QrCode.stop().then(() => { 
                    actualizarPantalla(data); 
                });
            }
        }
    ).catch((err) => console.error(err));
}

function actualizarPantalla(data) {
    document.querySelector('.pokedex').classList.remove('scanning');
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    const sprite = document.getElementById('main-sprite');
    sprite.src = data.sprite;
    sprite.classList.remove('shaking-ball'); // Limpiar animaciones previas
    
    pokemonDetectado = true; // Ahora el botón negro tiene permiso para actuar
    console.log("Pokémon listo para ser capturado");

    setTimeout(() => {
        new Audio(data.cry).play().catch(() => {});
    }, 300); 
}

// ESTA FUNCIÓN ES LA QUE ACTIVA EL BOTÓN NEGRO
function capturarPokemon() {
    console.log("Botón negro presionado");

    if (!pokemonDetectado) {
        console.log("No hay ningún Pokémon en pantalla para atrapar");
        return;
    }

    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // Cambiamos el Pokémon por tu Pokéball pixelada
    sprite.src = 'assets/img/pokeball.png'; 
    sprite.classList.add('shaking-ball'); // Inicia tu animación CSS
    texto.innerHTML = "¡ATRÁPALO!";

    // Simulamos la resistencia por 3 segundos
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡POKÉMON ATRAPADO!<br>REGISTRADO CON ÉXITO";
        pokemonDetectado = false; // Reset de estado
    }, 3000);
}
