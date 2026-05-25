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
        oSide: document.querySelector('.o-side'),
        toggleBtn: document.querySelector('#human-selection')
    }

    const eventHandler = function(clickGrid, clickRestart) {
        domElemnt.board.addEventListener('click', function(e) {
            if(!e.target.classList.contains('gamegrid')) return;
            if(game.showGameStatus()) return;
            if(e.target.textContent) return;

            let index = Number(e.target.id);
            const marker = game.showMarkerChoice();
            clickGrid(index);
            e.target.textContent = marker.human;

            showWinnerMessage();
            updatePoints();


            if(game.showGameStatus()) return;
            let computerIndex = game.computerChoice();
            clickGrid(computerIndex);
            domElemnt.grids[computerIndex].textContent = marker.computer;
            showWinnerMessage();
            updatePoints();

        })

        domElemnt.restartBtn.addEventListener('click',function(e) {
            clickRestart();
            clearDisplay();
        })

        domElemnt.toggleBtn.addEventListener('click', function(e) {
            let currentStep = game.showStep();
            if(currentStep > 0) {
                e.preventDefault();
                return;
            }
            game.changeMarker();
            const marker = game.showMarkerChoice();
            let computerIndex = game.computerChoice();
            clickGrid(computerIndex);
            domElemnt.grids[computerIndex].textContent = marker.computer;
            
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
        domElemnt.toggleBtn.checked = false;
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
    
    const remainingGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const selectedByX = [];
    const selectedByO = [];
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    const marker = {
        human: '❌',
        computer: '⭕️'
    }


    for(let i = 0; i < 9; i++) {
        const grid = makeGrid();
        gameboard.push(grid);
    }

    const computerChoice = function() {
        const randomIndex = Math.floor(Math.random() * remainingGrid.length);
        const chosenGrid = remainingGrid[randomIndex];
        return chosenGrid;
    }

    const showMarkerChoice = function() {
        return marker;
    }

    const changeMarker = function() {
        marker.human = '⭕️';
        marker.computer = '❌';
    }

    const play = function(index) {
        if(gameFinshed) {
            return;
        }
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
                remainingGrid.splice(remainingGrid.indexOf(index), 1);
                console.log(remainingGrid);
            }else if(isO) {
                gameboard[index].clicked = true;
                selectedByO.push(index);
                step++;
                remainingGrid.splice(remainingGrid.indexOf(index), 1);
                console.log(remainingGrid);
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
        remainingGrid.length = 0;
        remainingGrid.push(0, 1, 2, 3, 4, 5, 6, 7, 8);
        marker.human = '❌';
        marker.computer = '⭕️';
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

    const showStep = function() {
        return step;
    }

    return {
        play,
        restart,
        showWinner,
        showPointsOfX,
        showPointsOfO,
        showGameStatus,
        computerChoice,
        showMarkerChoice,
        changeMarker,
        showStep
    }
})()


displayController.eventHandler(game.play, game.restart);




