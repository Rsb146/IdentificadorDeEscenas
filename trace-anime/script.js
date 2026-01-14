const imageInput = document.getElementById("imageInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

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
        const response = await fetch("https://api.trace.moe/search", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.result.length === 0) {
            resultDiv.innerHTML = "No se encontró coincidencia 😢";
            return;
        }

        const anime = data.result[0];

        const minutos = Math.floor(anime.from / 60);
        const segundos = Math.floor(anime.from % 60);
        const titulo = anime.anilist.title.english || anime.anilist.title.romaji || anime.anilist.title.native;


        resultDiv.innerHTML = `
            <img src="${anime.image}" alt="Frame detectado"
                 style="
                    width: 100%;
                    border-radius: 10px;
                    box-shadow: inset 2px 2px 5px #b0b0b0;
                    margin-bottom: 10px;
                 ">

            <strong>Anime:</strong> ${anime.anime}<br>
            <strong>Episodio:</strong> ${anime.episode ?? "No disponible"}<br>
            <strong>Tiempo:</strong> ${minutos}:${segundos.toString().padStart(2, "0")}
        `;

    } catch (error) {
        resultDiv.innerHTML = "Error al consultar la API 😞";
        console.error(error);
    }
});

