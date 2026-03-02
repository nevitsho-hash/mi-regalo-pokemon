// ... (Mantenemos el objeto sonidos y pokemonDB igual que en la versión 14.0)

function iniciarCaptura(img, prob, msg) {
    const sprite = document.getElementById('main-sprite');
    const texto = document.getElementById('main-text');
    const esGengar = pokemonActualData.text.includes("GENGAR");

    pokemonDetectado = false;
    sprite.src = img;
    sprite.classList.add('is-pokeball', 'shaking-hard');
    texto.innerHTML = msg;

    // Fase 1: Suspense
    setTimeout(() => { 
        if (sprite.classList.contains('shaking-hard')) {
            sprite.classList.replace('shaking-hard', 'shaking-slow'); 
        }
    }, 1500);

    // Fase 2: Resultado
    setTimeout(() => {
        sprite.classList.remove('shaking-slow');
        
        if (Math.random() < prob) {
            // --- ÉXITO ---
            texto.innerHTML = "¡ATRAPADO!";
            sonidos.captura.play().catch(() => {});
            sprite.classList.add('captured-success');
            document.querySelectorAll('.led').forEach(l => l.classList.add('success'));

            if (esGengar) {
                // SECUENCIA GENGAR COFRE: Limpieza total para evitar solapamientos
                setTimeout(() => {
                    // Primero desvanecemos la Poké Ball por completo
                    sprite.style.transition = "opacity 0.8s ease";
                    sprite.style.opacity = "0";

                    setTimeout(() => {
                        // REINICIO DE ELEMENTO: Quitamos todas las clases de la Poké Ball
                        sprite.classList.remove('is-pokeball', 'captured-success', 'shaking-hard', 'shaking-slow');
                        
                        // Cargamos la nueva imagen y el sonido
                        sprite.src = "assets/img/gengar-cofre.png";
                        sonidos.brillo.currentTime = 0;
                        sonidos.brillo.play().catch(() => {});
                        
                        // Mostramos a Gengar con el cofre
                        sprite.style.opacity = "1";
                        sprite.style.transform = "scale(1.2)";
                        sprite.classList.add('clickable-chest');
                        texto.innerHTML = "GENGAR TIENE<br>ALGO PARA TI...";
                        sprite.onclick = abrirCofre;
                    }, 800); // Tiempo que dura el desvanecimiento
                }, 3500); // Tiempo que se queda la Poké Ball celebrando
            }
        } else {
            // --- FALLO ---
            texto.innerHTML = "¡SE ESCAPÓ!";
            sonidos.escapo.currentTime = 0;
            sonidos.escapo.play().catch(() => {});
            sprite.style.transform = "scale(0.35)";
            
            setTimeout(() => {
                sprite.classList.remove('is-pokeball', 'shaking-hard', 'shaking-slow');
                sprite.src = pokemonActualData.sprite;
                sprite.style.transform = "scale(1)";
                setTimeout(() => { 
                    texto.innerHTML = pokemonActualData.text; 
                    pokemonDetectado = true; 
                }, 200);
            }, 600);
        }
    }, 3500);
}
