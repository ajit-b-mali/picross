/**
 * @type HTMLCanvasElement
*/

//Game Board
const game = document.getElementById('gameBoard');
const gtx = game.getContext('2d');

//Guide Board
const canvas = document.getElementById('guide');
const ctx = canvas.getContext('2d');


//Canvas Dimensions..............................
let canvasSize = 500;

let GAMEWIDTH = game.width = canvasSize;
let GAMEHEIGHT = game.height = canvasSize;

let CANVASWIDTH = canvas.width = canvasSize;
let CANVASHEIGHT = canvas.height = canvasSize;

let cellCount = 5;
let cellSize = canvas.width/cellCount;
//...........................Canvas Dimension End


const nextBtn = document.getElementById('next');
//Levels..........................................
let level1 = {
    array: [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 1, 1],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 1, 1],
        [1, 0, 1, 1, 0]
    ],
    qArrayX: [
        '1<br>1',
        '1<br>1',
        '3',
        '4',
        '1<br>1'
    ],
    qArrayY: [
        '1',
        '1&nbsp;2',
        '1&nbsp;1',
        '4',
        '1&nbsp;2'
    ],
    totalCount: 13,
}

let level2 = {
    array: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ],
    qArrayX: [
        '5',
        '1<br>1',
        '1<br>1<br>1',
        '1<br>1',
        '5'
    ],
    qArrayY: [
        '5',
        '1&nbsp;1',
        '1&nbsp;1&nbsp;1',
        '1&nbsp;1',
        '5'
    ],
    totalCount: 17,
}

let level3 = {
    array: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
    ],
    qArrayX: [
        '1<br>1',
        '1<br>1',
        '1',
        '1<br>1',
        '1<br>1'
    ],
    qArrayY: [
        '1<br>1',
        '1<br>1',
        '1',
        '1<br>1',
        '1<br>1'
    ],
    totalCount: 9,
}
let levelList = [level1, level2, level3];
let currentLevel = 0;

let level = {}
//.....................................Levels End

//Initialization.......................................
function init(){
    level = levelList[0];
}
init();
//.......................................Initialization

//Game Variables.................................
//user's Variable................................
let user = {
    x: 0,
    y: 0,
    missCount: 5,
    winCount: 0,
}
//..............................user's Variable End
let stop = false;
//...............................Game Variables End

//The Guide Function.............................
function highlighter(x, y){
    ctx.fillStyle = 'rgba(123, 173, 230, .1)'
    ctx.fillRect(0, y, canvas.width, cellSize);
    ctx.fillRect(x, 0, cellSize, canvas.height);
}

function drawCross(x, y){
    const padding = (Math.ceil(cellSize / 5))
    const lWidth = (Math.ceil(cellSize / 10));
    gtx.strokeStyle = 'white';
    gtx.lineWidth = lWidth;
    gtx.moveTo(x + padding, y + padding);
    gtx.lineTo(x + cellSize - padding, y + cellSize - padding)
    gtx.moveTo(x + cellSize - padding, y + padding)
    gtx.lineTo(x + padding, y + cellSize - padding)
    gtx.stroke();
}
//.............................The Guide Function

//Win Or Loss......................................
function gamePlay(){
    const win = isWin();
    const loss = isLoss();
    if(win){
        stop = true;
        nextBtn.classList.add('display');
    }
    if(loss){
        stop = true;
    }
}

function isWin(){
    return level.totalCount == user.winCount;
}

function isLoss(){
    return user.missCount == 0;
}
//.......................................Win Or Loss

//The Main Draw Function...............................
function draw(){
    ctx.fillStyle = 'rgba(0, 0, 0, .05)';
    ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    highlighter(user.x, user.y);
    gamePlay();
    requestAnimationFrame(draw);
}
//...............................The Main Draw Function

//Restart Game.........................................
function restart(){
    reset();
    level.array.forEach((cols, y) => {
        cols.forEach((rows, x) => {
            if(rows == -1){
                level.array[y][x] = 1;
            }
        });
    });
}

//Original Values.....................................
function reset(){
    gtx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    user.x = 0;
    user.y = 0;
    user.missCount = 5;
    user.winCount = 0;
    stop = false;
    nextBtn.classList.remove('display');
}
//.......................................Original Values
//..........................................Restart Game
function next(){
    reset();
    currentLevel++;
    level=levelList[currentLevel];
    writePuzzle();
}


//Controls............................................
document.addEventListener('keydown', e => {
    //left.......
    if(e.key == 'ArrowLeft' && user.x > 0){
        user.x -= cellSize;
    }
    //right.......
    if(e.key == 'ArrowRight' && user.x < canvas.width - cellSize){
        user.x += cellSize;
    }
    //up.......
    if(e.key == 'ArrowUp' && user.y > 0){
        user.y -= cellSize;
    }
    //down.......
    if(e.key == 'ArrowDown' && user.y < canvas.height - cellSize){
        user.y += cellSize;
    }
    //'a' draw...
    if((e.key == 'a' || e.key == 'A') && stop == false){
        let cellX = Math.floor(user.x / cellSize);
        let cellY = Math.floor(user.y / cellSize);
        if(level.array[cellY][cellX] == 1){
            gtx.fillStyle = 'rgba(255, 0, 0,  1)';
            gtx.fillRect(user.x, user.y, cellSize, cellSize);
            user.winCount++;
            level.array[cellY][cellX] = -1;
        }else if(level.array[cellY][cellX] == 0){
            user.missCount--;
            drawCross(user.x, user.y);
        }
    }
});
//............................................Controls

//Main Puzzle arrangement.............................
const puzzle = {
    parentX: document.getElementById('x'),
    parentY: document.getElementById('y'),
    childX: [],
    childY: [],
}

//add child div.......................................
function hint(foo) {
    foo.textContent = '';
    for (let i = 0; i < cellCount; i++) {
        let temp = document.createElement('div');
        foo.appendChild(temp);
    }
}
//reference to child div.................................
function puzzleHome(){
    hint(puzzle.parentX);
    hint(puzzle.parentY);
    puzzle.childX = document.querySelectorAll('#x div');
    puzzle.childY = document.querySelectorAll('#y div');
}
puzzleHome();

function writePuzzle(){
    for(let i = 0; i < cellCount; i++){
        puzzle.childX[i].innerHTML = level.qArrayX[i];
        puzzle.childY[i].innerHTML = level.qArrayY[i];
    }
}
writePuzzle();
//............................reference to child div end
//....................................add child div end

const grid = document.getElementById('level');
grid.addEventListener('change', e => {
    cellCount = e.target.value;
    cellSize = canvas.width/cellCount;
    puzzleHome();
    restart();
    writePuzzle();
});
//...........................Main Puzzle arrangement End

draw();