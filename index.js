let firstTurn = true;
class Board {
    constructor() {
        this.dimension = Number(document.getElementById("dimensions-input").value);
        this.bombs = Math.floor(this.dimension * this.dimension / 5);
        this.board = new Array(this.dimension);
        for (let i = 0; i < this.dimension; i++) {
            this.board[i] = new Array(this.dimension);
        }
        this.unplacedFlags = this.bombs;
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                this.board[i][j] = {
                    condition: 0, // 0 - not revealed, 1 - flagged, 2 questioned, 3 - revealed, -1 - activated bomb
                    isBomb: false,
                    checked: false,
                    value: undefined
                }
            }
        }
    }

    initialize() {
        let bombToPlace = this.bombs;
        while (bombToPlace !== 0) {
            const x = Math.floor(Math.random() * this.dimension);
            const y = Math.floor(Math.random() * this.dimension);
            if (!this.board[x][y].isBomb && this.board[x][y].condition === 0) {
                this.board[x][y].isBomb = true;
                bombToPlace--;
            }
        }
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (!this.board[i][j].isBomb) {
                    this.board[i][j].value = this.tileValueCounter(i, j);
                }
            }
        }
        const userFlag = document.getElementById("user-flag");
        userFlag.style.visibility = "visible";
        const userBomb = document.getElementById("user-bomb");
        userBomb.style.visibility = "visible";

    }

    tileValueCounter(x, y) {
        let counter = 0;
        if (x !== 0) {
            if (this.board[x - 1][y].isBomb) {
                counter++;
            }
        }
        if (x !== this.dimension - 1) {
            if (this.board[x + 1][y].isBomb) {
                counter++;
            }
        }
        if (y !== 0) {
            if (this.board[x][y - 1].isBomb) {
                counter++;
            }
        }
        if (y !== this.dimension - 1) {
            if (this.board[x][y + 1].isBomb) {
                counter++;
            }
        }
        if (x !== 0 && y !== 0) {
            if (this.board[x - 1][y - 1].isBomb) {
                counter++;
            }
        }
        if (x !== 0 && y !== this.dimension - 1) {
            if (this.board[x - 1][y + 1].isBomb) {
                counter++;
            }
        }
        if (x !== this.dimension - 1 && y !== 0) {
            if (this.board[x + 1][y - 1].isBomb) {
                counter++;
            }
        }
        if (x !== this.dimension - 1 && y !== this.dimension - 1) {
            if (this.board[x + 1][y + 1].isBomb) {
                counter++;
            }
        }
        return counter;
    }
    displayBoard() {
        const tiles = document.querySelectorAll(".game-tile");
        const bombText = document.getElementById("bomb-count");
        bombText.innerHTML = String(this.bombs);
        const flagText = document.getElementById("flag-count");
        flagText.innerHTML = String(this.unplacedFlags);
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if( this.board[i][j].condition === 0) {
                    tiles[i * this.dimension + j].style.backgroundImage = "url('data/tile.png')";
                    continue;
                }
                if (this.board[i][j].condition === 1) {
                    tiles[i * this.dimension + j].style.backgroundImage = "url('data/flag.png')";
                    continue;
                }
                if (this.board[i][j].condition === 2) {
                    tiles[i * this.dimension + j].style.backgroundImage = "url('data/questionMark.png')";
                    continue;
                }
                if (this.board[i][j].condition === -1) {
                    tiles[i * this.dimension + j].style.backgroundImage = "url('data/boom.png')";
                    continue;
                }
                if (this.board[i][j].condition === 3) {
                    if (this.board[i][j].isBomb) {
                        tiles[i * this.dimension + j].style.backgroundImage = "url('data/mine.png')";
                        continue;
                    }
                    switch (this.board[i][j].value) {
                        case 0:
                            tiles[i * this.dimension + j].style.backgroundImage = "none";
                            break;
                        case 1:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/one.png')";
                            break;
                        case 2:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/two.png')";
                            break;
                        case 3:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/three.png')";
                            break;
                        case 4:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/four.png')";
                            break;
                        case 5:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/five.png')";
                            break;
                        case 6:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/six.png')";
                            break;
                        case 7:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/seven.png')";
                            break;
                        case 8:
                            tiles[i * this.dimension + j].style.backgroundImage = "url('data/eight.png')";
                            break;
                    }
                }
            }
        }
    }
    showMines(){
        for(let i=0; i< this.dimension; i++){
            for(let j=0; j< this.dimension; j++){
                if(this.board[i][j].isBomb && this.board[i][j].condition !== -1){
                    this.board[i][j].condition = 3;
                }
            }
        }
    }
    disableTiles(){
        const tiles = document.querySelectorAll(".game-tile");
        tiles.forEach(tile => {
            tile.setAttribute("disabled", "true");
        })
    }
    checkWin(){
        let counter = 0;
        for(let i=0; i< this.dimension; i++){
            for(let j=0; j< this.dimension; j++){
                this.board[i][j].checked = false;
                if(this.board[i][j].condition === 3){
                    counter++;
                }
            }
        }
        return (counter === (this.dimension* this.dimension - this.bombs));
    }
    tileOpener(x,y){
    if (this.board[x][y].condition === 0 && !this.board[x][y].checked && !this.board[x][y].isBomb) {
        this.board[x][y].checked = true;
        this.board[x][y].condition = 3;
        const tiles = document.querySelectorAll(".game-tile");
        tiles[x * this.dimension + y].setAttribute("disabled", "true");
        if (this.board[x][y].value === 0) {
                if (x !== 0) {
                    this.tileOpener(x - 1, y);
                }
                if (x !== this.dimension - 1) {
                    this.tileOpener(x + 1, y);
                }
                if (y !== 0) {
                    this.tileOpener(x, y - 1);
                }
                if (y !== this.dimension - 1) {
                    this.tileOpener(x, y + 1);
                }
            }
        }
    }
}
let game;
document.getElementById("OK-button").addEventListener("click", function(){
  const dimension = Number(document.getElementById("dimensions-input").value);
  for(let i=0; i < dimension;i++)
    {
        for (let j=0; j < dimension; j++)
        {
            const tile = document.createElement("button" );
            tile.appendChild(document.createTextNode(""));
            tile.className = "game-tile";
            tile.id = 'tile'+i+';'+j;
            document.body.getElementsByClassName("game-field")[0].appendChild(tile);
            if (j===0)
            {
                tile.className = "game-tile end-button";
            }
        }
    }
    document.getElementById("OK-button").setAttribute("disabled", "true");
    document.getElementById("dimensions-input").setAttribute("disabled", "true");
    game = new Board();
    Click();
    rightClick();
})
const Click = () => {
document.querySelectorAll(".game-tile").forEach(element => element.addEventListener("click", function(){
    const x = Number(this.id.split(";")[0].split("tile")[1]);
    const y = Number(this.id.split(";")[1]);
    if(firstTurn)
    {
        firstTurn = false;
        game.initialize();
        game.tileOpener(x,y);
    }
    else if (game.board[x][y].condition === 0) {
        if (game.board[x][y].isBomb) {
            game.board[x][y].condition = -1;
            game.showMines();
            game.disableTiles();
            game.displayBoard();
            alert("You lost!");
        }
        else {
            game.tileOpener(x,y);
        }
    }
    game.displayBoard();
    if(game.checkWin())
    {
        game.disableTiles();
        alert("You won!");
    }
}))}
const rightClick = () => {
    document.querySelectorAll(".game-tile").forEach(element => element.addEventListener("contextmenu", function(){
        const x = Number(this.id.split(";")[0].split("tile")[1]);
        const y = Number(this.id.split(";")[1]);
        if (game.board[x][y].condition === 2) {
            game.board[x][y].condition = 0;
        }
        else if (game.board[x][y].condition === 0 && game.unplacedFlags !== 0) {
            game.board[x][y].condition++;
            game.unplacedFlags--;
        }
        else if (game.board[x][y].condition === 1) {
            game.board[x][y].condition++;
            game.unplacedFlags++;
        }
        game.displayBoard();
    }))
}
