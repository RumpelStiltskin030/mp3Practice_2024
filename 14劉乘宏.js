const menuBtn = document.querySelector('.menu-btn');
const plusBtn = document.querySelector('.plus-btn');
const container = document.querySelector('.container');

menuBtn.addEventListener('click', function () {
    container.classList.toggle('active');
});

plusBtn.addEventListener('click', function () {
    container.classList.toggle('plus-active');
});

let playing = false;
let currentSong = 0;
let shuffle = false;
let repeat = false;
let repeatOne = false;
const audio = new Audio();

const songs = [
    {
        title: '蘑菇之歌',
        artist: '小啼大作',
        img_src: 'mogumogu.jpg',
        src: "mogumogu.mp3"
    },
    {
        title: '水豚之歌',
        artist: 'Сто-Личный Она-Нас / Betsy',
        img_src: 'capibara.jpg',
        src: "capibara.mp3"
    },
    {
        title: '惡魔之歌',
        artist: 'Rick Astley',
        img_src: 'DEVIL.jpg',
        src: "DEVIL.mp3"
    },
    {
        title: '破音之歌',
        artist: 'Shirley Morrow',
        img_src: 'Until_the_End.jpg',
        src: "Until_the_End.mp3"
    },
    {
        title: '洗腦之歌',
        artist: 'Mr. Trololo',
        img_src: 'YeahYeahYeahOOO.jpg',
        src: "YeahYeahYeahOOO.mp3"
    }
]

const readyListSongs = [
    
]

const allSongSList = songs.concat(readyListSongs);

function init() {
    updatePlayList(songs);
    updateReadyList(songs,readyListSongs);
    dragInit();
    loadSong(currentSong);
}

const playListContainer = document.querySelector('#playlist');
const infoWrapper = document.querySelector('.info');
const coverImage = document.querySelector('.cover-image');

function updatePlayList(songs) {
    playListContainer.innerHTML = '';

    songs.forEach((song, index) => {
        const title = song.title;
        const src = song.src;

        const tr = document.createElement('tr');
        tr.classList.add('song');
        tr.innerHTML = `
            <td class="no">
                <h5>${index+1}</h5>
            </td>
            <td class="title">
                <h6>${title}</h6>
            </td>
            <td class="length">
                <h5>3:00</h5>
            </td>`;

        playListContainer.appendChild(tr);

        const audioForDuration = new Audio(`music/${src}`);
        audioForDuration.addEventListener('loadedmetadata', () => {
            const duration = audioForDuration.duration;

            let songDuration = formatTime(duration);
            tr.querySelector(`.length h5`).innerText = songDuration;
        })
        tr.addEventListener('click', () => {
            currentSong = index;
            loadSong(currentSong);
            audio.play();
            container.classList.remove('active');
            playpauseBtn.classList.replace('fa-play', 'fa-pause');
            playing = true;
        });
    });
}

function formatTime (time){
    let min = Math.floor(time/60);
    let sec = Math.floor(time%60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    if (min < 10) {
        min = `0${min}`;
    }
    return `${min}:${sec}`;
}

function loadSong(songIndex){
    infoWrapper.innerHTML = `
    <h2>${songs[songIndex].title}</h2>
    <h3>${songs[songIndex].artist}</h3>`;

    coverImage.style.backgroundImage = `url('musicPither/${songs[songIndex].img_src}')`;

    audio.src = `music/${songs[songIndex].src}`;
}

const playpauseBtn = document.querySelector('#playpause');
const stopMusicBtn = document.querySelector('#stopMusic');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const prev3sBtn = document.querySelector('#prev3s');
const next3sBtn = document.querySelector('#next3s');
const volumeBar = document.querySelector('#volume-bar')
const muteBtn = document.querySelector('#mute-btn')
const progressbar = document.querySelector('#progressBar')
const currentTimeEl = document.querySelector('.current-time')
const durationEl = document.querySelector('.duration')
const shuffleBtn = document.querySelector('#shuffle')
const repeatBtn = document.querySelector('#repeat')
const repeatOneBtn = document.querySelector('#repeatOne')
nextBtn.addEventListener('click',nextSong)
prevBtn.addEventListener('click',prevSong)
next3sBtn.addEventListener('click',() => changTime(+5))
prev3sBtn.addEventListener('click',() => changTime(-5))
volumeBar.addEventListener('input',changVolume)
muteBtn.addEventListener('click',mute)

playpauseBtn.addEventListener('click',() => {
    if(playing){
        playpauseBtn.classList.replace('fa-pause' , 'fa-play');
        playing = false;
        audio.pause();
    }else{
        playpauseBtn.classList.replace('fa-play' , 'fa-pause');
        playing = true;
        audio.play();
    }
})


stopMusicBtn.addEventListener('click',() => {
    audio.pause();
    audio.currentTime = 0;
    playing = false;
    playpauseBtn.classList.replace('fa-pause' , 'fa-play');
})

function normalPlay() {
    if( currentSong<songs.length-1){
        currentSong++;
    }else{
        audio.pause();
        playing = false;
        playpauseBtn.classList.replace('fa-pause' , 'fa-play');
        return
    }
}

function nextSong(){
    if (currentSong < songs.length - 1){
        currentSong++;
    }else {
        currentSong = 0;
    }
    
    loadSong(currentSong);

    if(playing){
        audio.play();
    }
}

function prevSong(){
    if(currentSong == 0){
        currentSong = songs.length - 1;
    }else {
        currentSong--;
    }

    loadSong(currentSong);

    if(playing){
        audio.play();
    }
}

function changTime(time){
    audio.currentTime+=time;
}

function progress(){
    let duration = audio.duration;
    let currentTime = audio.currentTime;

    isNaN(duration) ? duration = 0 : duration = duration;
    isNaN(currentTime) ? currentTime = 0 : currentTime = currentTime;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);

    let progressPercent = (currentTime/duration) *100;
    progressbar.value = progressPercent;
}

audio.addEventListener('timeupdate',progress);

progressbar.addEventListener('input',() => {
    audio.currentTime = progressbar.value * audio.duration / 100;
})

let range = volumeBar.value;

function changVolume(){
    audio.volume = volumeBar.value / 100;
    range = volumeBar.value;    
}

function mute(){
    audio.muted = !audio.muted;
    if(audio.muted){
        volumeBar.value=0;
    }else{
        volumeBar.value = range;
    }
}

shuffleBtn.addEventListener('click', function () {
    shuffle = !shuffle;
    repeat = false;
    repeatOne = false;
    shuffleBtn.classList.toggle('active');
    repeatBtn.classList.remove('active');
    repeatOneBtn.classList.remove('active');
});

repeatBtn.addEventListener('click', function () {
    repeat = !repeat;
    shuffle = false;
    repeatOne = false;
    repeatBtn.classList.toggle('active');
    repeatOneBtn.classList.remove('active');
    shuffleBtn.classList.remove('active');
});

repeatOneBtn.addEventListener('click', function () {
    repeatOne = !repeatOne;
    shuffle = false;
    repeat = false;
    repeatOneBtn.classList.toggle('active');
    repeatBtn.classList.remove('active');
    shuffleBtn.classList.remove('active');
});

audio.addEventListener('ended',() =>{
    if(repeat){
        nextSong();
    }else if (repeatOne){
        loadSong(currentSong);
        audio.play();
    }else if (shuffle){
        currentSong = Math.floor(Math.random() * songs.length);
        loadSong(currentSong);
        audio.play();
    }else{
        normalPlay();
    }
})

const readyListContainer = document.querySelector('#readyList');
const playingListContainer = document.querySelector('#playingList');

function updateReadyList(songs, readyListSongs){
    let readyContainer = readyListContainer.children[0];
    let playingContainer = playingListContainer.children[0];
    readyContainer.innerText = '';
    playingContainer.innerText='';

    readyListSongs.forEach((song, index) => {
        const title = song.title;
        const src = song.src;

        const tr = document.createElement('tr');
        tr.classList.add('dragSong');
        tr.draggable = true;
        tr.innerHTML = `
        <td class="no">
            <i class="fa-solid fa-grip-lines" style="cursor: grab;"></i>
        </td>
        <td class="title">
            <h6>${title}</h6>
        </td>
        <td class="length">
            <h5>03:00</h5>
        </td>`;

        readyContainer.appendChild(tr);

        const audioForDuration = new Audio(`music/${src}`);
        audioForDuration.addEventListener('loadedmetadata',() =>{
            const duration = audioForDuration.duration;
            let songDuration = formatTime(duration);
            tr.querySelector('.length h5').innerText = songDuration;
        })
    })

    
    songs.forEach((song, index) => {
        const title = song.title;
        const src = song.src;

        const tr = document.createElement('tr');
        tr.classList.add('dragSong');
        tr.draggable = true;
        tr.innerHTML = `
        <td class="no">
            <i class="fa-solid fa-grip-lines" style="cursor: grab;"></i>
        </td>
        <td class="title">
            <h6>${title}</h6>
        </td>
        <td class="length">
            <h5>03:00</h5>
        </td>`;

        playingContainer.appendChild(tr);

        const audioForDuration = new Audio(`music/${src}`);
        audioForDuration.addEventListener('loadedmetadata',() =>{
            const duration = audioForDuration.duration;
            let songDuration = formatTime(duration);
            tr.querySelector('.length h5').innerText = songDuration;
        })
    })
}

function dragInit(){
    const dragSongs = document.querySelectorAll('.dragSong');
    const readyListArea = document.querySelector('#readyList');
    const playingListArea = document.querySelector('#playingList');
    
    dragSongs.forEach((song,index) =>{
        song.addEventListener('dragstart',(e) =>{
            let selected = e.target;
    
            playingListArea.addEventListener('dragover', (e) => {
                e.preventDefault();
            })
    
            playingListArea.addEventListener('drop', (e) => {
                playingListArea.children[0].appendChild(selected);
                selected = null;
            })
    
            readyListArea.addEventListener('dragover', (e) => {
                e.preventDefault();
            })
    
            readyListArea.addEventListener('drop', (e) => {
                readyListArea.children[0].appendChild(selected);
                selected = null;
            })
        })
    })
}

const refreshBtn = document.querySelector('.refresh');
refreshBtn.addEventListener('click', refreshSongs);

function refreshSongs() {
    const readyList = document.querySelector('#playingList').querySelectorAll('.dragSong');
    const newSongs = [];
    const newReadySongs = [];
    readyList.forEach((item, index) => {
        const songTitile = item.querySelector('.title h6').innerText;
        for (let i = 0; i < allSongSList.length; i++) {
            if (allSongSList[i].title === songTitile) {
                newSongs.push(allSongSList[i]);
            }
        }
    })
    allSongSList.forEach((song, index) => {
        if (!newSongs.includes(song)) {
            newReadySongs.push(song);
        }
    })


    songs.length = 0;
    readyListSongs.length = 0;
    newSongs.forEach((song, index) => {
        songs.push(song);
    })
    newReadySongs.forEach((song, index) => {
        readyListSongs.push(song);
    })

    currentSong = 0;
    playing = false;

    updatePlayList(songs);
    updateReadyList(songs,readyListSongs);
    dragInit();
    container.classList.remove('plus-active');
    playpauseBtn.classList.replace('fa-pause', 'fa-play');
    audio.pause();
    loadSong(currentSong);
}

init();