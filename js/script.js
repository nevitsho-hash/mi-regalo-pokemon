const sonidoBoton = new Audio('assets/sng/clic.mp3');
let pokemonDetectado = true;
let html5QrCode;

function activarEscaner() {
    sonidoBoton.play().catch(() => {});
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    if (!html5QrCode) { html5QrCode = new Html5Qrcode("reader"); }
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: 200 }, (text) => {
        html5QrCode.stop().then(() => { 
            document.getElementById('reader').style.display = 'none';
            document.getElementById('pokedex-content').style.display = 'flex';
            pokemonDetectado = true;
        });
    }).catch(err => console.error(err));
}

function capturarPokemon() {
    if (!pokemonDetectado) return;
    const sprite = document.getElementById('main-sprite');
    sprite.src = 'assets/img/pokeball.png'; // Tu imagen pixelada [cite: 2026-02-28]
    sprite.classList.add('shaking-ball'); 
    document.getElementById('main-text').innerHTML = "¡ATRÁPALO!";
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        document.getElementById('main-text').innerHTML = "¡CAPTURADO!";
        pokemonDetectado = false;
    }, 3000);
}
