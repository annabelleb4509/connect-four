/*----- constants -----*/

const COLORS = {
    '0': 'white',
    '1': 'orange',
    '-1': 'black',
};



/*----- state variables -----*/

const state = {
    board: null,
    turn: null,
    winner: null,
};



/*----- cached elements  -----*/

const elements = {
    message: document.querySelector('h1'),
    playAgain: document.querySelector('button'),
    markers: document.querySelectorAll('#markers > div')
};




/*----- event listeners -----*/

document.getElementById('markers').addEventListener('click', handleDrop); 
elements.playAgain.addEventListener('click', init);


/*----- functions -----*/

init();

function init() {
    // To visualize the board, rotate the array 90 degrees anticlockwise:
    state.board = [
        [0, 0, 0, 0, 0, 0], //column 0
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0], //column 6
    ];
    state.turn = 1;
    state.winner = null;
    render();
}

function handleDrop(event) {  
    console.log('drop detected');
   
    // find the column number
   const columnIndex = [...elements.markers].indexOf(event.target);  // [...elements.markers] turns thsis element which is a NodeList into an array - because only as an array we can use IndexOf and access teh elements/values inside
   if (columnIndex === -1) {
        return; // exit the function (so the rest doesn't get mad)
   }
   // find the column data
   const column = state.board[columnIndex];
    // find the first available slot (0) in that column
   const rowIndex = column.indexOf(0);
   if (rowIndex === -1) {
    return; // this column is full
   }
// assign that slot to the current player
   column[rowIndex] = state.turn;
    // change to the next player
   state.turn *= -1; // 1, -1, 1, -1, 1, -1
   // check for a winner?
    state.winner = checkWinner(rowIndex, columnIndex);
    render();
}


function checkWinner(row, column) {
    return (
    checkVertical(row, column) ||
    checkHorizontal(row, column) ||
    checkDiagonalUpperLeftToLowerRight(row, column) ||
    checkDiagonalLowerLeftToUpperRight(row, column) ||
    checkDraw()
    );
}
// did someone win? player : null
function checkVertical(row, column) {
    return countAdjacent(row, column, -1, 0) >= 3 ? state.board[column][row] : null;
}

function checkHorizontal(row, column) {
   const countLeft =  countAdjacent(row, column, 0, -1);
   const countRight =  countAdjacent(row, column, 0, 1);
   return (countLeft + countRight >= 3) ? state.board[column][row] : null;
}

function checkDiagonalUpperLeftToLowerRight(row, column) {
    const countLeft =  countAdjacent(row, column, -1, -1);
    const countRight =  countAdjacent(row, column, 1, 1);
    return (countLeft + countRight >= 3) ? state.board[column][row] : null;
}

function checkDiagonalLowerLeftToUpperRight(row, column) {
    const countLeft =  countAdjacent(row, column, 1, -1);
    const countRight =  countAdjacent(row, column, -1, 1);
    return (countLeft + countRight >= 3) ? state.board[column][row] : null;
}


function countAdjacent(row, column, rowOffset, columnOffset) {
   const player = state.board[column][row]; // who just played?
   let count = 0;
   row += rowOffset;
   column += columnOffset;
   while (
    state.board[column] !== undefined &&
    state.board[column][row] !== undefined &&
    state.board[column][row] === player
   ) {
    count += 1;
    row += rowOffset;
    column += columnOffset;
   }
   return count;
}

function checkDraw() {
    for (let columnIndex = 0; columnIndex < state.board.length; columnIndex++) {
        for (let rowIndex = 0; rowIndex < state.board[columnIndex].length; rowIndex++) {
            if (state.board[columnIndex][rowIndex] === 0) {
                return null;
            }
        }
    }
    return 'Tie';
}   


function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    state.board.forEach(function (column, columnIndex) {
        column.forEach(function (piece, rowIndex) {
            const id = `c${ columnIndex }r${ rowIndex }`;
            const circle = document.getElementById(id);
            circle.style.backgroundColor = COLORS[piece];
        })
    })
    
}

function renderMessage() {
// show winner
    if (state.winner === 'Tie') {
        elements.message.innerHTML = `It's a draw`;
    } else if (state.winner) {
        elements.message.innerHTML = `<span style="color: ${ COLORS[state.winner] }">${ COLORS[state.winner] }</span> wins!`; 
    } else {
//TODO: show tie
        elements.message.innerHTML = `<span style="color: ${ COLORS[state.turn] }">${ COLORS[state.turn] }</span>'s turn`;   
    }
}


function renderControls() {
        elements.markers.forEach(function (marker) {
            marker.style.visibility = state.winner ? 'hidden' : 'visible';
        });
    }