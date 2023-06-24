const gameArea = document.getElementById('gameArea');  
const goodposition = document.getElementById('status');
const newGameButton = document.getElementById('new-game');
const saveGameButton = document.getElementById('save-game');
const loadgameButton = document.getElementById('load-game');
const optionsButton = document.getElementById('options');
optionsButton.addEventListener('click', options);
newGameButton.onclick = () => {newGame();};
saveGameButton.onclick = () => {saveGame();};
loadgameButton.onclick = () => {loadGame();};
let row=1;
let col=1;
let index = 0;
let randomNumbers = [];
let path ="./img/2/"; 
let difficulty = "easy" 
let gameRows = 4;
let gameCols = 4; 
let puzzlePcs = 15;

const pictures=[
  {
    name: "barbie1",
    path: "./img/1/",
    difficulty: "easy",
    rows: 4,
    cols: 4,
    puzzlePcs: 15,
  },
  {
    name: "fishing1",
    path: "./img/2/",
    difficulty: "easy",
    rows: 4,
    cols: 4,
    puzzlePcs: 15,
  },
]
newGame();

function reset(){
  gameArea.innerHTML=""
  gameArea.className="";
  gameArea.classList.add(difficulty);
  row=1;
  col=1;
  index = 0;
  
};
 
function generateRandomNumbers(){
  randomNumbers =[];
  for (let i = 0; randomNumbers.length < puzzlePcs; i++){
    let randomNumber = Math.floor(Math.random()*puzzlePcs+1);
    if (randomNumbers.indexOf(randomNumber) === -1){
      randomNumbers.push(randomNumber);
    }
  }
};

function createGemeBoard(){
  
  for (let i=0; i < puzzlePcs; i++) {
      row = col <= gameRows ? row : ++row;
      col= col <= gameCols ? col : 1;
      let tile = document.createElement("div");
      tile.classList.add(`tile-${difficulty}`);
      tile.setAttribute("row", row); 
      tile.setAttribute("col", col++);
      tile.setAttribute("value", randomNumbers[index]);
      tile.innerText=randomNumbers[index++];
      tile.addEventListener("click", move);  
      tile.style.backgroundImage = `url('${path + randomNumbers[index-1]}.png')`;
      gameArea.append(tile); 
  }
  let tile = document.createElement("div");
  tile.classList.add("tile-blank");
  tile.setAttribute("row", row); 
  tile.setAttribute("col", col++);
  tile.setAttribute("value", puzzlePcs+1);
  gameArea.append(tile);
  tile.addEventListener("click", move);
};

//main game loop
function newGame() {
  reset();  
  generateRandomNumbers(); 
  createGemeBoard()
}

//tile movement 
function move(event){
  let tile = event.currentTarget;
  let currentPositionRow = parseInt(tile.getAttribute("row"));
  let currentPositionCol = parseInt(tile.getAttribute("col"));
  let currentValue = parseInt(tile.getAttribute("value")); 
 
  let neighbors = [
    { row: currentPositionRow, col: currentPositionCol + 1 },  // right
    { row: currentPositionRow, col: currentPositionCol - 1 },  // left
    { row: currentPositionRow - 1, col: currentPositionCol },  // up
    { row: currentPositionRow + 1, col: currentPositionCol },  // down
  ];
  
  neighbors.forEach(neighbor => {
    let neighborTile = document.querySelector(`[row="${neighbor.row}"][col="${neighbor.col}"]`);
    if (neighborTile && neighborTile.getAttribute("value") == puzzlePcs+1) {
      console.log(`(${neighbor.row},${neighbor.col}) lehetséges lépés`);
      neighborTile.setAttribute("value", currentValue);
      neighborTile.innerText=currentValue
      neighborTile.classList.remove("tile-blank");
      neighborTile.classList.add(`tile-${difficulty}`);
      neighborTile.style.backgroundImage = `url('${path + currentValue}.png')`;
      tile.setAttribute("value", puzzlePcs+1);
      tile.innerText = "";
      tile.classList.remove(`tile-${difficulty}`);
      tile.classList.add("tile-blank");  
      tile.style.backgroundImage="none";   
    } else {
      console.log(`(${neighbor.row},${neighbor.col}) lépés nem lehetséges`);
    }
  });
  winnerPosition();
}

//winner checking 
function winnerPosition(){
  let row=1;
  let col=1;
  let correctPosition = 0;
  for (let i = 1; i < puzzlePcs+1; i++) {  
    row = col <= gameRows ? row : ++row;
    col= col <= gameCols ? col : 1;
    if(document.querySelector(`[row="${row}"][col="${col++}"]`).getAttribute("value") == i){
    console.log(`row=${row}, col=${col} helyes!`);  
    correctPosition++  
  }
  goodposition.innerText= correctPosition + " / " + puzzlePcs; 
  }  
  if (correctPosition==puzzlePcs){
    let lastTile = document.querySelector(`[row="${gameRows}"][col="${gameCols}"]`);
    lastTile.innerText = puzzlePcs + 1 ;
    lastTile.classList.remove("tile-blank");
    lastTile.classList.add(`tile-${difficulty}`);
    lastTile.style.backgroundImage = `url('${path + (puzzlePcs+1)}.png')`; 
    setTimeout(function() {
    alert("A játéknak vége!"),1000});
  }
}

//options
function options(){
  gameArea.innerHTML = "";
  gameArea.className="";
  gameArea.classList.add("options");
  gameArea.innerHTML = 
  `
    <h2 class="text-center mt-3">Beállítások</h2>
    <div class="border-1 d-block"> 
      <h3 class="text-center mt-3">Difficulty</h3>
      <span class="difficulty-text text-center fw-bold"> ${difficulty.toUpperCase()}</span>
      <div class="difficulty-buttons d-flex justify-content-center">
        <button type="button" id="easy-btn" class="btn btn-primary m-3">EASY</button>
        <button type="button" id="medium-btn" class="btn btn-primary  m-3">Medium</button>
        <button type="button" id="hard-btn" class="btn btn-primary m-3 ">Hard</button>
      </div>
    </div>
    <h3  class="text-center mt-3 ">Puzzle</h3>
    <div id="puzzle-select"></div>
    <div class="button d-flex justify-content-center">
      <button type="button" id="new-game2" class="btn btn-primary">New Game</button>
    </div>
  `;
  const difficultyText=document.querySelector('span');
  const puzzleSelect = document.getElementById("puzzle-select");
  document.getElementById('easy-btn').onclick = () =>{
    difficulty="easy";  
    gameRows = 4;
    gameCols = 4; 
    puzzlePcs = 15;   
    difficultyText.innerText=difficulty.toUpperCase();
    puzzleSelect.innerHTML=""
    for(let i=0; i< pictures.length; i++){  
      if(pictures[i].difficulty == difficulty){
        
        let puzzle = document.createElement("div");
        puzzle.classList.add("puzzle-icon");
        puzzle.style.backgroundImage = `url('${pictures[i].path}bg.png')`; 
        puzzle.onclick= () => {
          path = pictures[i].path;
          puzzle.style.border = "1px solid black";
        }
        puzzleSelect.append(puzzle);
      }
    }
  };
  document.getElementById('medium-btn').onclick = () =>{
    difficulty="medium";  
    gameRows = 6;
    gameCols = 6; 
    puzzlePcs = 35; 
    difficultyText.innerText=difficulty.toUpperCase();
    puzzleSelect.innerHTML=""
  };
  document.getElementById('hard-btn').onclick = () =>{
    difficulty="hard";  
    gameRows = 10;
    gameCols = 10; 
    puzzlePcs = 99;
    difficultyText.innerText=difficulty.toUpperCase();   
    puzzleSelect.innerHTML=""
  };
  document.getElementById("new-game2").onclick= () => { newGame(); }; 
};
function saveGame(){
  // save tile positions
  let savedRandomnumbers= [];
  let puzzleTile= document.querySelectorAll("[value]");
  for (let i=0; i< puzzlePcs+1; i++) {
    let number = parseInt(puzzleTile[i].getAttribute("value"));
    savedRandomnumbers.push(number);    
  };
  localStorage.setItem("RandomNumbers", savedRandomnumbers);
  
  
  //save difficulty, rows, cols, puzzlepcs, path  
  localStorage.setItem("Difficulty", difficulty);
  localStorage.setItem("GameRow", gameRows);
  localStorage.setItem("GameCol", gameCols);
  localStorage.setItem("PuzzlePcs", puzzlePcs);
  localStorage.setItem("Path", path);

  alert("Game saved");
};
function loadGame(){
  if(confirm("Figyelem az el nem mentett játék el fog veszni")){
    //load tile positions
    if(localStorage.getItem("RandomNumbers")){
      let loadRandomNumbers=[];
      loadRandomNumbers = localStorage.getItem("RandomNumbers").split(",")
      randomNumbers=loadRandomNumbers;
      
      //load difficulty, rows, cols, puzzlepcs, path  
      difficulty= localStorage.getItem("Difficulty");  
      gameRows = parseInt(localStorage.getItem("GameRow"));
      gameCols = parseInt(localStorage.getItem("GameCol")); 
      puzzlePcs = parseInt(localStorage.getItem("PuzzlePcs"));
      path = localStorage.getItem("Path"); 
      reset();  
      //
      for (let i=0; i < puzzlePcs+1; i++) {
        row = col <= gameRows ? row : ++row;
        col= col <= gameCols ? col : 1;
        let tile = document.createElement("div");
        tile.setAttribute("row", row); 
        tile.setAttribute("col", col++);
        if(randomNumbers[index] == puzzlePcs+1){          
          tile.classList.add("tile-blank");
          tile.setAttribute("value", puzzlePcs+1);
          index++;
          gameArea.append(tile);
          tile.addEventListener("click", move);
        }else{
          tile.classList.add(`tile-${difficulty}`);
          tile.setAttribute("value", randomNumbers[index]);
          tile.innerText=randomNumbers[index++];
          tile.addEventListener("click", move);  
          tile.style.backgroundImage = `url('${path + randomNumbers[index-1]}.png')`;
          gameArea.append(tile); 
        }
    }
      //
      alert("game loaded"); 
    }else{
      alert("Nincs mentett játék!");
    }
  }else{
    alert("game not loaded"); 
  }
  
};