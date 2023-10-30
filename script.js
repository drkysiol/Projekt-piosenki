document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const songsDiv = document.querySelector('.songs')
    const genreOptions = document.querySelector('#genre-select');
    const tempoSelect = document.querySelector('#tempo-select');
    const searchInput = document.querySelector('#search-input');
    const sortDurationButton = document.getElementById('sort-duration-button');
    let songs = []

    function convertSecToMin(seconds) {
        let minutes = Math.floor(seconds / 60);
        let extraSeconds = seconds % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
        return minutes + ":" + extraSeconds
    }

    function sortSongsByDuration() {
        const sortedsongs = songs.sort((a, b) => a.duration - b.duration);

        songsDiv.innerHTML = '';
        sortedsongs.forEach(song => {
            time = convertSecToMin(song.duration)
            songsDiv.innerHTML += `
                <div class="song">
                    <img src="${song.coverUrl}" alt="Song Cover">
                    <div class="info"> 
                        <h2 class="title">${song.title}</h2>
                        <h2 class="artists">${song.artists}</h2>
                        <h2 class="artists">${time}</h2>
                    </div>   
                </div>
            `;
        });
    }
    
    function updateSongsDisplay() {
        songs = []
        songsDiv.innerHTML = '';
        const genre = genreOptions.value;
        const tempo = tempoSelect.value;
        const search = searchInput.value.toLowerCase();
        fetch('https://gist.githubusercontent.com/techniadrian/c39f844edbacee0439bfeb107227325b/raw/81eec7847b1b3dfa1c7031586405c93e9a9c1a2d/songs.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(song => {
                if (
                    (tempo === 'all' || tempo === 'slow' && song.bpm <= 110 || tempo === 'medium' && song.bpm >= 110 && song.bpm <= 130 || tempo === 'fast' && song.bpm >= 130) && 
                    (genre === 'all' || genre === song.genre) &&
                    (search === '' || song.title.toLowerCase().includes(search.toLowerCase()))
                ) {
                    songs.push(song)
                    time = convertSecToMin(song.duration)
                songsDiv.innerHTML += `
                    <div class="song">
                        <img src="${song.coverUrl}" alt="Song Cover">
                        <div class="info"> 
                            <h2 class="title">${song.title}</h2>
                            <h2 class="artists">${song.artists}</h2>
                            <h2 class="artists">${time}</h2>
                        </div>
                    </div>
                `;
                }
            });
        })

    }
    fetch('https://gist.githubusercontent.com/techniadrian/6ccdb1c837d431bb84c2dfedbec2e435/raw/60783ebfa89c6fd658aaf556b9f7162553ac0729/genres.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(genre => {
                genreOptions.innerHTML += `
                <option value="${genre}">${genre}</option>
                `;
            });
        })
    updateSongsDisplay();
    genreOptions.addEventListener('change', updateSongsDisplay);
    tempoSelect.addEventListener('change', updateSongsDisplay);
    searchInput.addEventListener('input', updateSongsDisplay);
    sortDurationButton.addEventListener('click',sortSongsByDuration);
}); 