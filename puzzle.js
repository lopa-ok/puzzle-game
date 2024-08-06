const puzzleSize = 3;
const puzzleContainer = document.getElementById('puzzle');
let tiles = [];


function initializePuzzle() {
    tiles = [];
    puzzleContainer.innerHTML = '';
    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = i;
        if (i === puzzleSize * puzzleSize - 1) {
            tile.classList.add('empty-tile');
        } else {
            tile.textContent = i + 1;
        }
        tile.addEventListener('click', () => handleTileClick(i));
        puzzleContainer.appendChild(tile);
        tiles.push(tile);
    }
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
    }
}


function resetPuzzle() {
    initializePuzzle();
}


initializePuzzle();
