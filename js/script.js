alert("Welcome in the Spotify Clone by PandaPiyush")
let currentSong=new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    // Calculate whole minutes and remaining seconds\
    
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Ensure the minutes and seconds are formatted to always have two digits
    var formattedMinutes = minutes.toString().padStart(2, '0');
    var formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Combine them in the format "mm:ss"
    var formattedTime = `${formattedMinutes}:${formattedSeconds}`;
    
    return formattedTime;
}
async function getSongs(folder) {
    currFolder=folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    

    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
       songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` 
        <li class=" libplay flex">
                        <img class= "invert"src="img/music.svg" alt="">
                        <div class="info">
                            <div class="songname">${song.replaceAll("%20", " ")}</div>
                            <div class="artist"></div>
                        </div>
                        <img class="invert" id="play_" src="img/play.svg" alt="">
                       </li> 
        `
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=> {
       e.addEventListener("click",element=>{
        
           playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
           play.src="img/pause.svg"
          e.querySelector("#play_").src="img/pause.svg"

       })
        
    });
}
const playMusic=(track=songs[0],pause=false)=>{
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
    currentSong.play();
    play.src = "img/pause.svg"}
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
    //document.getElementById("play").src="img/pause.svg"
   
}

async function displayAlbums(){
    let a=await fetch(`/songs/`)
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response
    let anchors=div.getElementsByTagName("a");
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder= (e.href.split("/").slice(-2)[0])
            let a=await fetch(`/songs/${folder}/info.json`)
    let response=await a.json();
    let artist=document.querySelector(".artist")
    //artist.innerHTML=response.title
   
    let cardContainer=document.querySelector(".cardContainer")
    cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                    <img aria-hidden="false" draggable="false" loading="lazy"
                        src="/songs/${folder}/cover.jpg" data-testid="card-image"
                        alt=""
                        class="Arjit">
                    <h2>${response.title}</h2>
                    <p>${response.heading}</p>
                </div>`
                
        }

    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
             await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            // playMusic(songs[0]);

        })
    })

}

async function main() {
    displayAlbums()
     await getSongs("songs/ncs2");
    playMusic(songs[0],true)
    
    
    document.getElementById("play").addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
            

        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
            
        }

    })
    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    next.addEventListener("click",()=>{
           
           let index;
           if (currentSong && currentSong.src) {
            let srcParts = currentSong.src.split("/");
            if (srcParts.length > 0) {
                let fileName = srcParts.slice(-1)[0];
                 index = songs.indexOf(fileName);
                // Use index as needed
            } else {
                console.error("Invalid currentSong.src format");
            }
        } else {
            console.error("currentSong or currentSong.src is null or undefined");
        }
        
           
           if((index+1)<songs.length){
            playMusic(songs[index+1])
           }
           else{
            playMusic(songs[0])
           }
           play.src="img/pause.svg"

    })
    previous.addEventListener("click",()=>{
        
        let index;
        
        if (currentSong && currentSong.src) {
            let srcParts = currentSong.src.split("/");
            if (srcParts.length > 0) {
                let fileName = srcParts.slice(-1)[0];
                 index = songs.indexOf(fileName);
                // Use index as needed
            } else {
                console.error("Invalid currentSong.src format");
            }
        } else {
            console.error("currentSong or currentSong.src is null or undefined");
        }
        
           console.log(currentSong.src.split("/").slice(-1)[0],index)
           if((index-1)>=0){
            playMusic(songs[index-1])
           }
           else{
            playMusic(songs[0])
           }
           play.src="img/pause.svg"
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        
        currentSong.volume=parseInt(e.target.value)/100;
    })
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
             await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })
    
    

    
}
main()