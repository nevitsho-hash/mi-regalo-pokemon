// ... (Tus variables de sonido y pokemonDB se quedan igual) ...

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('btn-capturar').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 200 },
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                pokemonDetectado = pokemonDB[code];
                
                // DETENEMOS CÁMARA Y MOSTRAMOS AL POKEMON SIN EL SONIDO FINAL AÚN
                html5QrCode.stop().then(() => {
                    document.getElementById('reader').style.display = 'none';
                    document.getElementById('pokedex-content').style.display = 'flex';
                    
                    // Cargamos los datos en la pantalla
                    document.getElementById('main-text').innerHTML = pokemonDetectado.text;
                    document.getElementById('main-sprite').src = pokemonDetectado.sprite;
                    
                    // AHORA APARECE EL BOTÓN DE CAPTURAR
                    document.getElementById('btn-capturar').style.display = 'block';
                });
            }
        }
    ).catch(err => console.error(err));
}

// Acción final al pulsar el botón
document.getElementById('btn-capturar').onclick = function() {
    this.style.display = 'none'; // Desaparece el botón
    
    // Suena la captura y el grito
    sonidoCaptura.play();
    
    setTimeout(() => {
        const audioGrito = new Audio(pokemonDetectado.cry);
        audioGrito.play();
    }, 1000);
    
    // Aquí podrías añadir una animación de flash o parpadeo si quisieras
};
