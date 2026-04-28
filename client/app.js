const API = "http://localhost:3000";

// ===== DOM =====
const list = document.querySelector(".song-list");
const audio = new Audio();
let currentIndex = -1;
let songs = [];

// ===== LOAD SONG =====
async function loadSongs() {
    const res = await fetch(API + "/songs");
    songs = await res.json();

    list.innerHTML = "";

    songs.forEach((song, index) => {
        const row = document.createElement("div");
        row.className = "song-row";

        row.innerHTML = `
            <div class="col index">${index + 1}</div>
            <div class="col name">${song.name}</div>
            <div class="col artist">Unknown Artist</div>
            <div class="col actions">
                <button onclick="playSong(${index})">▶</button>
                <button onclick="deleteSong('${song._id}')">🗑</button>
            </div>
        `;

        list.appendChild(row);
    });
}

loadSongs();


// ===== PLAY =====
window.playSong = function (index) {
    const song = songs[index];

    if (!song) return;

    audio.src = API + "/" + song.path;
    audio.play();

    currentIndex = index;
};


// ===== NEXT / PREV =====
window.nextSong = function () {
    if (currentIndex < songs.length - 1) {
        playSong(currentIndex + 1);
    }
};

window.prevSong = function () {
    if (currentIndex > 0) {
        playSong(currentIndex - 1);
    }
};


// ===== DELETE =====
window.deleteSong = async function (id) {
    await fetch(API + "/songs/" + id, {
        method: "DELETE"
    });

    loadSongs();
};


// ===== UPLOAD =====
const uploadInput = document.querySelector("#fileInput");
const uploadBtn = document.querySelector("#uploadBtn");

uploadBtn.onclick = async () => {
    const file = uploadInput.files[0];
    if (!file) return alert("Chọn file đi");

    const formData = new FormData();
    formData.append("song", file);

    await fetch(API + "/upload", {
        method: "POST",
        body: formData
    });

    uploadInput.value = "";
    loadSongs();
};