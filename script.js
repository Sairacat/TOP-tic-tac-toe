function makeGrid() {
    const clicked = false;
    const clickedByX = false;
    const clickedByO = false;
    return {clicked, clickedByX, clickedByO};
}

const game = (function() {
    const gameboard = [];

    let isX = true;
    let isO = false;

    let pointOfX = 0;
    let pointOfO = 0;
    let step = 0;
    
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

    const play = function() {
        let index = e.target.id;
        if(gameboard[index].clicked) {
            console.log('This grid has been clicked! Choose another one!');
            return;
        }else {
            if(this.name === 'X') {
                gameboard[index].clicked = true;
                gameboard[index].clickedByX =true;
                selectedByX.push(index);
                step++;
            }else if(this.name === 'O') {
                gameboard[index].clicked = true;
                gameboard[index].clickedByO = true;
                selectedByO.push(index);
                step++;
            }

        }

        if(step > 4) {
            if(this.name === 'X') {
                for(const pattern of winningPatterns) {
                    if(pattern.every(item => selectedByX.includes(item))) {
                        pointOfX++
                        console.log('X win!');
                    }
                }
            }else if(this.name === 'O') {
                for(pattern of winningPatterns) {
                    if(pattern.every(item => selectedByO.includes(item))) {
                        pointOfO++
                        console.log('O win!');
                    }
                }
            }
        }else if(step === 9) {
            console.log('It\'s a draw');
        }
    }

    const showPoint = function() {
        if(this.name === 'X') {
            console.log(`Points of X is ${pointOfX}`);
        }else if(this.name ==='O') {
            console.log(`Points of O is ${pointOfO}`);
        }
    }

    const restart = function() {
        for(const grid of gameboard) {
            grid.clicked = false;
            grid.clickedByX = false;
            grid.clickedByO = false;
        }
        selectedByX.length = 0;
        selectedByO.length = 0;
        step = 0;

        console.log('Game has restarted!')
    }

    return {
        createPlayer(name) {
            return {name, play, showPoint};
        },
        restart
    }
})()


const playerX = game.createPlayer('X');
const playerO = game.createPlayer('O');