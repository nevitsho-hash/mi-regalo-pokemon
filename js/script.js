// Prueba rápida de sonido y ruta
const sonidoBoton = new Audio('assets/snd/clic.mp3'); // Asegúrate que en GitHub sea clic.mp3 en minúsculas
const sonidoCaptura = new Audio('assets/snd/captura.wav');

const pokemonDB = {
    "BEAUTIFLY": { 
        text: "¡PRUEBA DE RUTA CORRECTA!", 
        sprite: "assets/img/BEAUTIFLY.png" // Exactamente como me dijiste
    }
};

function actualizarPantalla(data) {
    sonidoCaptura.play().catch(e => console.log("Error sonido:", e));
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}

function actualizarPantalla(data) {
    // Intentar sonido de captura
    sonidoCaptura.play().catch(() => console.log("Sonido captura bloqueado"));

    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    
    // Cambiamos la imagen
    const imgElement = document.getElementById('main-sprite');
    imgElement.src = data.sprite;
    
    // Si la imagen falla (error 404), intentamos cargarla en minúsculas automáticamente
    imgElement.onerror = function() {
        if (this.src.includes('.PNG')) {
            this.src = this.src.replace('.PNG', '.png').toLowerCase();
        }
    };
}
