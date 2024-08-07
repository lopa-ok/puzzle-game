const puzzleContainer = document.getElementById('puzzle');
const tileSize = 100;
let tiles = [];
let solvedOrder = [];
let imageUrl = '';
let puzzleSize = 3;

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

async function fetchRandomImage() {
    try {
        const response = await fetch('https://picsum.photos/300');
        imageUrl = response.url;
        console.log(`Fetched Image URL: ${imageUrl}`);
        document.getElementById('previewImage').src = imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

function isSolvable(array) {
    let inversions = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] && array[j] && array[i] > array[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
}

function getShuffledOrder() {
    let shuffled;
    do {
        shuffled = shuffle(getSolvedOrder().slice());
    } while (!isSolvable(shuffled));
    return shuffled;
}

async function initializePuzzle() {
    await fetchRandomImage();
    tiles = [];
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${puzzleSize}, ${tileSize}px)`;

    let tileNumbers = getShuffledOrder();

    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        const row = Math.floor(i / puzzleSize);
        const col = i % puzzleSize;

        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundImage = `url(${imageUrl})`;
        tile.style.backgroundSize = `${puzzleSize * tileSize}px ${puzzleSize * tileSize}px`;

        if (tileNumbers[i] === null) {
            tile.classList.add('empty-tile');
            tile.style.backgroundImage = 'none';
        } else {
            const shuffledRow = Math.floor((tileNumbers[i] - 1) / puzzleSize);
            const shuffledCol = (tileNumbers[i] - 1) % puzzleSize;
            tile.style.backgroundPosition = `${-shuffledCol * tileSize}px ${-shuffledRow * tileSize}px`;
            tile.dataset.number = tileNumbers[i];
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
        tiles[emptyIndex].style.backgroundImage = tiles[index].style.backgroundImage;
        tiles[emptyIndex].style.backgroundPosition = tiles[index].style.backgroundPosition;
        tiles[emptyIndex].dataset.number = tiles[index].dataset.number;
        tiles[index].style.backgroundImage = 'none';
        tiles[index].classList.add('empty-tile');
        tiles[emptyIndex].classList.remove('empty-tile');
        delete tiles[index].dataset.number;

        if (isPuzzleSolved()) {
            showWinningScreen();
        }
    }
}

function isPuzzleSolved() {
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        if (tile.classList.contains('empty-tile')) {
            if (i !== tiles.length - 1) {
                return false;
            }
        } else {
            const correctNumber = solvedOrder[i];
            const tileNumber = tile.dataset.number ? parseInt(tile.dataset.number) : null;

            if (correctNumber !== tileNumber) {
                return false;
            }
        }
    }
    return true;
}

function showWinningScreen() {
    const winningScreen = document.querySelector('.winning-screen');
    winningScreen.style.display = 'flex';
}

function resetPuzzle() {
    const winningScreen = document.querySelector('.winning-screen');
    if (winningScreen) {
        winningScreen.style.display = 'none';
    }
    initializePuzzle();
}

document.getElementById('difficulty').addEventListener('change', (event) => {
    puzzleSize = parseInt(event.target.value);
    resetPuzzle();
});

initializePuzzle();
