/* ... (Base de datos y activarEscaner igual) ... */

function capturarPokemon() {
    if (!pokemonDetectado) return;
    
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const originalSprite = sprite.src; // Guardamos el Pokémon por si escapa
    const originalText = texto.innerHTML;

    // Fase 1: Lanzamiento y movimiento BRUSCO
    sprite.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = "¡ATRÁPALO...!";

    // Fase 2: A los 1.5 segundos, el movimiento se calma
    setTimeout(() => {
        sprite.classList.remove('shaking-hard');
        sprite.classList.add('shaking-slow');
    }, 1500);

    // Fase 3: Resolución (Éxito o Fallo) a los 3.5 segundos
    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        
        // CÁLCULO DE PROBABILIDADES (70% éxito, 30% fallo) [cite: 2026-03-01]
        const exito = Math.random() > 0.3;

        if (exito) {
            texto.innerHTML = "¡POKÉMON ATRAPADO!";
            pokemonDetectado = false;
        } else {
            // FALLO DE CAPTURA
            sprite.classList.add('capture-failed');
            texto.innerHTML = "¡OH NO! <br> SE HA ESCAPADO";
            
            setTimeout(() => {
                sprite.classList.remove('is-pokeball', 'capture-failed');
                sprite.src = originalSprite; // Vuelve el Pokémon
                sprite.style.width = "120px";
                texto.innerHTML = originalText;
                pokemonDetectado = true;
            }, 1500);
        }
    }, 3500);
}

/* ... (Resto de funciones igual) ... */
