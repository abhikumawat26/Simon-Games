let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector('h2');

document.addEventListener("keypress", function(){
    if(started == false)
    {
        console.log("Game is started");
        started = true;
        levelUp();
    }
});

function btnFlash(btn){
    btn.classList.add("flash"); 
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

    let randIndex = Math.floor(Math.random() *btns.length);
    let randColor = btns[randIndex];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    btnFlash(randBtn);
}

function checkAns()
{
    let index = userSeq.length-1;
    if(userSeq[index] == gameSeq[index])
    {
        if(userSeq.length == gameSeq.length)
        {
            setTimeout(levelUp, 1000);
        }
    }
    else
    {
        h2.innerHTML = `Game over! You reached Level ${level}. <br> Press any key to start`;
        reset();
    }
}

function btnPress() {
    console.log(this);
    let btn = this;
    userFlash(btn);

    let userColor =  btn.getAttribute("id");
    userSeq.push(userColor);
    console.log("Game:", gameSeq);
    console.log("User:", userSeq);
    checkAns();
}

let allBtns = document.querySelectorAll(".btn");

for(btn of allBtns)
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