const pokemonDB = {
    "BEAUTIFLY": { text: "¡MIRA ESA BEAUTIFLY!<br>SUS ALAS SON BELLAS,<br>¡PERO TU ERES MAS<br>QUE CUALQUIER POKEMON!", sprite: "beautifly.png" },
    "SNORLAX": { text: "¡HAS ENCONTRADO<br>A SNORLAX!<br>DORMILON POR EXCELENCIA", sprite: "snorlax.png" },
    "SWALOT": { text: "¡HAS ENCONTRADO<br>A SWALOT!<br>EL POKEMON BOLSA", sprite: "swalot.png" },
    "TOTODILE": { text: "¡HAS ENCONTRADO<br>A TOTODILE!<br>EL COCODRILO ALEGRE", sprite: "totodile.png" },
    "UMBREON": { text: "¡HAS ENCONTRADO<br>A UMBREON!<br>LUZ EN LA OSCURIDAD", sprite: "umbreon.png" },
    "JIGGLYPUFF": { text: "¡HAS ENCONTRADO<br>A JIGGLYPUFF!<br>CUIDADO CON SU CANTO", sprite: "jigglypuff.png" },
    "GENGAR": { text: "¡HAS ENCONTRADO<br>A GENGAR!<br>LA SOMBRA TRAVIESA", sprite: "gengar.png" }
};

let html5QrCode;

function activarEscaner() {
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('reader').style.display = 'block';

    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            let code = decodedText.toUpperCase().trim();
            if (pokemonDB[code]) {
                actualizarPantalla(pokemonDB[code]);
            } else {
                alert("CÓDIGO NO REGISTRADO: " + decodedText);
                actualizarPantalla({ text: "ERROR:<br>POKEMON NO<br>REGISTRADO", sprite: "gengar.png" });
            }
            html5QrCode.stop();
        }
    ).catch((err) => {
        alert("Error de cámara: " + err);
        document.getElementById('pokedex-content').style.display = 'flex';
        document.getElementById('reader').style.display = 'none';
    });
}

function actualizarPantalla(data) {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('pokedex-content').style.display = 'flex';
    document.getElementById('main-text').innerHTML = data.text;
    document.getElementById('main-sprite').src = data.sprite;
}
