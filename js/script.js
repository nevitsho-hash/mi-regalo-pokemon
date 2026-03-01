// Base de datos de Pokémon (puedes ampliarla)
const pokemonDB = {
    "GENGAR": {
        text: "¡HAS ENCONTRADO A GENGAR!<br>LA SOMBRA TRAVIESA",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        // URL de grito funcional (usando la API oficial)
        cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/94.ogg"
    },
    // Añade más códigos QR aquí...
    "PIKACHU": {
        text: "¡ATRAPADO PIKACHU!<br>EL POKÉMON ELÉCTRICO",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg"
    }
};

let html5QrCode;
let estadoOriginal = null; // Guardará el estado de Gengar al inicio

// Sonidos básicos (asegúrate de tener este archivo)
const sonidoBoton = new Audio('assets/sng/click.mp3'); 

function activarEscaner() {
    // Sonido de botón al pulsar
    sonidoBoton.play().catch(e => console.log("Sonido de click no cargado"));
    
    // Guarda el estado actual de la pantalla si es la primera vez que escaneamos
    if (!estadoOriginal) {
        estadoOriginal = {
            text: document.getElementById('main-text').innerHTML,
            sprite: document.getElementById('main-sprite').src
        };
    }

    // Activa animación de LEDs
    document.querySelector('.pokedex').classList.add('scanning');
    
    // Oculta contenido y muestra cámara
    document.getElementById('pokedex-content').style.display = 'none';
    const readerElement = document.getElementById('reader');
    readerElement.style.display = 'block';

    // Inicializa el lector si no existe
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    // Configuración de la cámara: QRBox rectangular grande
    const config = { fps: 15, qrbox: { width: 300, height: 250 } };

    html5QrCode.start(
        { facingMode: "environment" }, // Cámara trasera si es móvil
        config,
        (decodedText) => {
            // Éxito en el escaneo
            console.log("QR Detectado:", decodedText);
            
            // Convierte a mayúsculas y limpia espacios por si acaso
            const pokeCode = decodedText.toUpperCase().trim();
            
            if (pokemonDB[pokeCode]) {
                const data = pokemonDB[pokeCode];
                
                // Detiene el escáner
                html5QrCode.stop().then(() => {
                    actualizarPantalla(data);
                });
            } else {
                // Si el QR no está en la base de datos
                html5QrCode.stop().then(() => {
                    actualizarPantalla({
                        text: "CÓDIGO QR<br>DESCONOCIDO...",
                        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png", // Icono de huevo/pokeball
                        cry: null
                    });
                });
            }
        }
    ).catch((err) => {
        // Error al iniciar la cámara (ej: permisos denegados)
        console.error(err);
        document.querySelector('.pokedex').classList.remove('scanning');
        document.getElementById('pokedex-content').style.display = 'flex';
        document.getElementById('reader').style.display = 'none';
        document.getElementById('main-text').innerHTML = "ERROR AL INICIAR<br>LA CÁMARA";
    });
}

function actualizarPantalla(data) {
    // Detiene animación LEDs
    document.querySelector('.pokedex').classList.remove('scanning');

    // Muestra contenido y oculta cámara
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';

    // Actualiza texto e imagen
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;

    // Reproduce el grito del Pokémon
    if (data.cry) {
        const audioGrito = new Audio(data.cry);
        // Pequeño delay para que no suene justo al aparecer
        setTimeout(() => {
            audioGrito.play().catch(e => console.log("Grito no cargado"));
        }, 300);
    }
}
