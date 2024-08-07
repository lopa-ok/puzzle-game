const puzzleSize = 3;
const puzzleContainer = document.getElementById('puzzle');
let tiles = [];
let solvedOrder = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getSolvedOrder() {
    return Array.from({ length: puzzleSize * puzzleSize - 1 }, (_, i) => i + 1).concat(null);
}

function initializePuzzle() {
    tiles = [];
    puzzleContainer.innerHTML = '';

    let tileNumbers = getSolvedOrder();
    tileNumbers = shuffle(tileNumbers);

    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = i;
        if (tileNumbers[i] === null) {
            tile.classList.add('empty-tile');
        } else {
            tile.textContent = tileNumbers[i];
        }
        tile.addEventListener('click', () => handleTileClick(i));
        puzzleContainer.appendChild(tile);
        tiles.push(tile);
    }

    solvedOrder = getSolvedOrder();
}

function handleTileClick(index) {
    const emptyIndex = tiles.findIndex(tile => tile.classList.contains('empty-tile'));
    const [row, col] = [Math.floor(index / puzzleSize), index % puzzleSize];
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / puzzleSize), emptyIndex % puzzleSize];
    
    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
        tiles[emptyIndex].textContent = tiles[index].textContent;
        tiles[index].textContent = '';
        tiles[emptyIndex].classList.remove('empty-tile');
        tiles[index].classList.add('empty-tile');

        if (isPuzzleSolved()) {
            showWinningScreen();
        }
    }
}

function isPuzzleSolved() {
    return tiles.every((tile, index) => {
        if (tile.classList.contains('empty-tile')) {
            return solvedOrder[index] === null;
        }
        return parseInt(tile.textContent) === solvedOrder[index];
    });
}

function showWinningScreen() {
    const winningScreen = document.createElement('div');
    winningScreen.className = 'winning-screen';
    winningScreen.innerHTML = `<h1>You Win!</h1><button onclick="resetPuzzle()">Play Again</button>`;
    document.body.appendChild(winningScreen);
}

function resetPuzzle() {
    const winningScreen = document.querySelector('.winning-screen');
    if (winningScreen) {
        winningScreen.remove();
    }
    initializePuzzle();
}

initializePuzzle();

