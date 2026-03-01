// ... (Base de datos y funciones de escáner iguales) ...

function capturarSuper() {
    if (!pokemonDetectado || !pokemonActualData) return;
    sonidoBoton.play().catch(() => {});
    
    // Imagen oficial de la Super Ball (Great Ball) azul y roja
    const ballImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    
    // Probabilidad doble para la Super Ball
    iniciarProcesoCaptura(ballImg, (pokemonActualData.catchRate * 2), "¡SUPER BALL VA!", true);
}

function iniciarProcesoCaptura(img, prob, msg, esSuper) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const oldImg = sprite.src;
    const oldTxt = texto.innerHTML;

    sprite.src = img;
    sprite.classList.add('is-pokeball');
    
    // Aplicamos clase específica si es Super Ball para control visual
    if(esSuper) {
        sprite.classList.add('is-greatball');
    } else {
        sprite.classList.remove('is-greatball');
    }

    sprite.classList.add('shaking-hard');
    texto.innerHTML = msg;

    // ... (Resto de la lógica de tiempos de sacudida y éxito igual) ...
}
