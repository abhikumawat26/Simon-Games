let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector('h2');

// ---------- Web Audio ----------
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function unlockAudio() {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}
document.addEventListener("keydown", unlockAudio);
document.addEventListener("pointerdown", unlockAudio);

// One frequency (Hz) per color
const tones = {
    green: 329.63,   // E4
    red: 261.63,     // C4
    yellow: 392.00,  // G4
    purple: 440.00   // A4
};

function playTone(color, duration = 0.3) {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = tones[color];

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
}

function playGameOver() {
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
}

// ---------- Game ----------
document.addEventListener("keydown", function(){
    if(started == false)
    {
        console.log("Game is started");
        started = true;
        levelUp();
    }
});

function btnFlash(btn){
    btn.classList.add("flash");
    playTone(btn.id);                 
    setTimeout(function(){
        btn.classList.remove("flash");
    },250);
}

function userFlash(btn){
    btn.classList.add("userFlash");
    setTimeout(function(){
        btn.classList.remove("userFlash");
    },250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randIndex = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIndex];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    btnFlash(randBtn);
}

function checkAns()
{
    let index = userSeq.length - 1;
    if(userSeq[index] == gameSeq[index])
    {
        if(userSeq.length == gameSeq.length)
        {
            setTimeout(levelUp, 1000);
        }
    }
    else
    {
        playGameOver();               
        h2.innerHTML = `Game over! You reached Level ${level}. <br> Press any key to start`;
        reset();
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    playTone(userColor);              
    userSeq.push(userColor);
    console.log("Game:", gameSeq);
    console.log("User:", userSeq);
    checkAns();
}

let allBtns = document.querySelectorAll(".btn");

for(let btn of allBtns)
{
    btn.addEventListener("click", btnPress);
}

function reset()
{
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}
