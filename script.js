function makeGrid() {
    const clicked = false;
    return {clicked};
}

const game = (function() {
    const gameboard = [];

    let isX = true;
    let isO = false;

    let pointOfX = 0;
    let pointOfO = 0;
    let step = 0;
    let gameFinshed = false;
    let xHasWon = false;
    let oHasWon = false;
    
    const selectedByX = [];
    const selectedByO = [];
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]


    for(let i = 0; i < 9; i++) {
        const grid = makeGrid();
        gameboard.push(grid);
    }

    const play = function(e) {
        let index = Number(e.target.id);
        console.log(`index is ${index}`);
        if(gameboard[index].clicked) {
            console.log('This grid has been clicked! Choose another one!');
            return;
        }else {
            if(isX) {
                gameboard[index].clicked = true;
                selectedByX.push(index);
                step++;
                console.log('X has moved');
            }else if(isO) {
                gameboard[index].clicked = true;
                selectedByO.push(index);
                step++;
                console.log('O has moved');
            }

        }

        examWhoWins();
        changeSide();
        console.log(isX);
        console.log(isO);
        console.log(step);
        console.log(selectedByX);
        console.log(selectedByO);
    }

    const showTurn = function() {
        return isX;
    }

    const restart = function() {
        for(const grid of gameboard) {
            grid.clicked = false;
        }
        for(const gamegrid of gameGrids) {
            gamegrid.textContent = '';
        }
        selectedByX.length = 0;
        selectedByO.length = 0;
        step = 0;
        isX = true;
        isO = false;
        gameFinshed = false;
        xHasWon = false;
        oHasWon = false;
        messageOfX.textContent = '';
        messageOfO.textContent = '';

        console.log('Game has restarted!')
    }

    const changeSide = function() {
        isX = isO;
        isO = !isX;
    }

    const examWhoWins = function() {
        if(step > 4 && step < 9) {
            if(isX) {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByX.includes(item))) {
                        pointOfX++;
                        console.log('X win!');
                        gameFinshed = true;
                        xHasWon = true;
                    }
                }
            }else if(isO) {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByO.includes(item))) {
                        pointOfO++;
                        console.log('O win!');
                        gameFinshed = true;
                        oHasWon = true;
                    }
                }
            }
        }
        
        if(step === 9) {
            if(isX) {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByX.includes(item))) {
                        pointOfX++;
                        console.log('X win!');
                        gameFinshed = true;
                        xHasWon = true;
                    }
                }
            }else {
                console.log('It\'s a draw')
                gameFinshed = true;
            }
        }

        updatePoints();
        showWinnerMessage();
    }

    const showGameHasFinishedOrNot = function() {
        return gameFinshed;
    }

    const showWinnerMessage = function() {
        if(gameFinshed) {
            if(xHasWon) {
                messageOfX.textContent = 'X has Won!!';
                messageOfO.textContent = 'O has Lost!!';
            }else if(oHasWon) {
                messageOfX.textContent = 'X has Lost!!';
                messageOfO.textContent = 'O has Won!!';
            }else {
                messageOfX.textContent = 'It\'s a draw';
                messageOfO.textContent = 'It\'s a draw';
            }
        }else {
            return;
        }
    }

    const updatePoints = function() {
        domPointsOfX.textContent = pointOfX;
        domPointsOfO.textContent = pointOfO;
    }

    return {
        createPlayer(name) {
            return {name, play, showTurn};
        },
        restart,
        showGameHasFinishedOrNot
    }
})()


const playerX = game.createPlayer('X');
const playerO = game.createPlayer('O');

const domGridBoard = document.querySelector('.gameboard');
const restartBtn = document.querySelector('.restart-btn');
const gameGrids = document.querySelectorAll('.gamegrid');
const domPointsOfX = document.querySelector('.pointsofx');
const domPointsOfO = document.querySelector('.pointsofo');
const messageOfX = document.querySelector('.messageofx');
const messageOfO = document.querySelector('.messageofo')


domGridBoard.addEventListener('click', function(e) {
    let gameStatus = game.showGameHasFinishedOrNot();
    if(gameStatus) {
        console.log('game has finished, please restart');
        return;
    }
    let isTurnOfX = playerX.showTurn();
    if(e.target.textContent) {
        console.log('choose another one!');
        return;
    }
    if(isTurnOfX) {
        playerX.play(e);
        e.target.textContent = '❌';
    }else {
        playerO.play(e)
        e.target.textContent = '⭕️';
    }
})
restartBtn.addEventListener('click', () => {
    game.restart();
})