'use strict'

const displayController = (function() {
    const domElemnt = {
        board: document.querySelector('.gameboard'),
        restartBtn: document.querySelector('.restart-btn'),
        grids: document.querySelectorAll('.gamegrid'),
        pointsOfX: document.querySelector('.pointsofx'),
        pointsOfO: document.querySelector('.pointsofo'),
        messageOfX: document.querySelector('.messageofx'),
        messageOfO: document.querySelector('.messageofo'),
        xSide: document.querySelector('.x-side'),
        oSide: document.querySelector('.o-side')
    }

    const eventHandler = function(clickGrid, clickRestart) {
        domElemnt.board.addEventListener('click', function(e) {
            if(!e.target.classList.contains('gamegrid')) return;
            let index = Number(e.target.id);
            const marker = clickGrid(index);
            if(marker === 'X') {
                e.target.textContent = '❌';
            }else if(marker === 'O') {
                e.target.textContent = '⭕️';
            }else {
                return;
            }

            showWinnerMessage();
            updatePoints();
        })

        domElemnt.restartBtn.addEventListener('click',function(e) {
            clickRestart();
            clearDisplay();
        })
    }

    const showWinnerMessage = function() {
        const winner = game.showWinner();
        const gameStatus = game.showGameStatus();
        if(gameStatus) {
            if(winner === 'X') {
                domElemnt.messageOfX.textContent = 'X has Won!!';
                domElemnt.messageOfO.textContent = 'O has Lost!!';
                domElemnt.xSide.classList.add('won');
                domElemnt.oSide.classList.add('lost');
            }else if(winner === 'O') {
                domElemnt.messageOfX.textContent = 'X has Lost!!';
                domElemnt.messageOfO.textContent = 'O has Won!!';
                domElemnt.xSide.classList.add('lost');
                domElemnt.oSide.classList.add('won')
            }else {
                domElemnt.messageOfX.textContent = 'It\'s a draw';
                domElemnt.messageOfO.textContent = 'It\'s a draw';
            }
        }else {
            return;
        }
    }

    const updatePoints = function() {
        domElemnt.pointsOfX.textContent = game.showPointsOfX();
        domElemnt.pointsOfO.textContent = game.showPointsOfO();
    }

    const clearDisplay = function() {
        for(const gamegrid of domElemnt.grids) {
            gamegrid.textContent = '';
        }

        domElemnt.messageOfX.textContent = '';
        domElemnt.messageOfO.textContent = '';
        domElemnt.xSide.classList.remove('won', 'lost');
        domElemnt.oSide.classList.remove('won', 'lost');
    }

    return {eventHandler}
})()

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
    let winner;
    
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

    const play = function(index) {
        if(gameFinshed) {
            return;
        }
        let marker;
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
                marker = 'X';
            }else if(isO) {
                gameboard[index].clicked = true;
                selectedByO.push(index);
                step++;
                console.log('O has moved');
                marker = 'O';
            }

        }

        examWhoWins();
        changeSide();
        console.log(isX);
        console.log(isO);
        console.log(step);
        console.log(selectedByX);
        console.log(selectedByO);
        return marker;
    }

    const restart = function() {
        for(const grid of gameboard) {
            grid.clicked = false;
        }
        selectedByX.length = 0;
        selectedByO.length = 0;
        step = 0;
        isX = true;
        isO = false;
        gameFinshed = false;
        winner = '';
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
                        winner = 'X'
                        break;
                    }
                }
            }else if(isO) {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByO.includes(item))) {
                        pointOfO++;
                        console.log('O win!');
                        gameFinshed = true;
                        winner = 'O'
                        break;
                    }
                }
            }
        }
        
        if(step === 9) {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByX.includes(item))) {
                        pointOfX++;
                        console.log('X win!');
                        gameFinshed = true;
                        winner = 'X'
                        break;
                    }
                }

                if(!gameFinshed){
                console.log('It\'s a draw')
                gameFinshed = true;
                }
        }
    }

    const showWinner = function() {
        return winner;
    }

    const showPointsOfX = function() {
        return pointOfX;
    }

    const showPointsOfO = function() {
        return pointOfO;
    }

    const showGameStatus = function() {
        return gameFinshed;
    }

    return {
        play,
        restart,
        showWinner,
        showPointsOfX,
        showPointsOfO,
        showGameStatus
    }
})()


displayController.eventHandler(game.play, game.restart);



/* 
const domGridBoard = document.querySelector('.gameboard');
const restartBtn = document.querySelector('.restart-btn');
const gameGrids = document.querySelectorAll('.gamegrid');
const domPointsOfX = document.querySelector('.pointsofx');
const domPointsOfO = document.querySelector('.pointsofo');
const messageOfX = document.querySelector('.messageofx');
const messageOfO = document.querySelector('.messageofo');
const xSide = document.querySelector('.x-side');
const oSide = document.querySelector('.o-side');


domGridBoard.addEventListener('click', function(e) {
    if(!e.target.classList.contains('gamegrid')) return;
    let gameStatus = game.showGameHasFinishedOrNot();
    if(gameStatus) {
        console.log('game has finished, please restart');
        return;
    }
    let isTurnOfX = game.showTurn();
    if(e.target.textContent) {
        console.log('choose another one!');
        return;
    }
    if(isTurnOfX) {
        game.play(e);
        e.target.textContent = '❌';
    }else {
        game.play(e)
        e.target.textContent = '⭕️';
    }
})
restartBtn.addEventListener('click', () => {
    game.restart();
})
*/
