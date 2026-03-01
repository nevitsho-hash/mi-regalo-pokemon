function capturarPokemon() {
    if (!pokemonDetectado) return;
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');

    // 1. Cambiamos el Pokémon por tu Pokéball
    sprite.src = 'assets/img/pokeball.png'; 
    sprite.classList.add('shaking-ball'); 
    texto.innerHTML = "¡ATRÁPALO!";

    // 2. Animación de 3 segundos
    setTimeout(() => {
        sprite.classList.remove('shaking-ball');
        texto.innerHTML = "¡POKÉMON ATRAPADO!<br>REGISTRADO CON ÉXITO";
        pokemonDetectado = false;
    }, 3000);
}
