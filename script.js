const imageInput = document.getElementById("imageInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        resultDiv.innerHTML = "";
        return;
    }

    const previewURL = URL.createObjectURL(file);

    resultDiv.innerHTML = `
        <p><strong>Imagen seleccionada:</strong></p>
        <img src="${previewURL}" alt="Vista previa">
    `;
});

searchBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];

    if (!file) {
        alert("Por favor selecciona una imagen");
        return;
    }

    resultDiv.innerHTML = "Buscando... 🔍";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(
            "https://api.trace.moe/search?anilistInfo",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!data.result || data.result.length === 0) {
            resultDiv.innerHTML = "No se encontró coincidencia 😢";
            return;
        }

        const anime = data.result[0];

        const minutos = Math.floor(anime.from / 60);
        const segundos = Math.floor(anime.from % 60);

        const tituloRomaji  = anime.anilist?.title?.romaji  ?? "No disponible";

        resultDiv.innerHTML = `
            <img src="${anime.image}" alt="Frame detectado">

            <strong>Anime (Romaji):</strong> ${tituloRomaji}<br>
            <strong>Episodio:</strong> ${anime.episode ?? "No disponible"}<br>
            <strong>Tiempo:</strong> ${minutos}:${segundos
                .toString()
                .padStart(2, "0")}
        `;

    } catch (error) {
        resultDiv.innerHTML = "Error al consultar la API 😞";
        console.error(error);
    }
});