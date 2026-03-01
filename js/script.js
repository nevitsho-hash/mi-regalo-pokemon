/* ... (Base de datos igual) ... */

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    // ACTIVAR ANIMACIÓN DE LEDS [cite: 2026-03-01]
    document.querySelectorAll('.led').forEach(led => led.classList.add('animating'));

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
    
    // DESACTIVAR ANIMACIÓN DE LEDS [cite: 2026-03-01]
    document.querySelectorAll('.led').forEach(led => led.classList.remove('animating'));

    const sprite = document.getElementById('main-sprite');
    sprite.src = data.sprite;
    sprite.style.width = "120px"; 
    sprite.classList.remove('is-pokeball', 'shaking-ball');
    
    pokemonDetectado = true;
    setTimeout(() => { new Audio(data.cry).play().catch(() => {}); }, 300);
}

/* ... (función capturarPokemon igual) ... */
