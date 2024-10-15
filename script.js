const playerOptions = document.getElementById('player-options');
const startScreen = document.querySelector('.start-screen');
const gameDisplay = document.querySelector('.playground-display');
const playgroundScreen = document.querySelector('.playground-container');
const currentXCount = document.getElementById('x-value');
const currentOCount = document.getElementById('o-value');
let currentPlayer = '';
const elements = [];
for (let i = 1; i <= 9; i++) {
    elements.push(document.getElementById(i.toString()));
}
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const getCurrentRoundWinner = () => {

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            elements[a].querySelector('.x-shape') &&
            elements[b].querySelector('.x-shape') &&
            elements[c].querySelector('.x-shape')
        ) {
            return 'Player x';
        }
        if (
            elements[a].querySelector('.o-shape') &&
            elements[b].querySelector('.o-shape') &&
            elements[c].querySelector('.o-shape')
        ) {
            return 'Player o';
        }
    }

    const allFilled = elements.every(el => el.querySelector('.x-shape') || el.querySelector('.o-shape'));
    if (allFilled) {
        return 'draw';
    }

    return null;
};

const resetBoard = () => {
    elements.forEach(el => {
        el.innerHTML = '';
        el.addEventListener('click', updateId);
    });
};

const winner = str => {
    setTimeout(() => {
        playgroundScreen.style.display = 'none';
        startScreen.style.display = 'block';
    }, 500);
    startScreen.innerHTML = `
    <div class="next-round-screen">
        <h2>${str.toUpperCase()} won the Game!</h2>
        <button id="new-game-btn">Start a new Game</button>
    </div>
    `;
    document.getElementById('new-game-btn').addEventListener('click', () => {
        startScreen.innerHTML = `
            <h2>Choose a Player</h2>
            <button id="x-button" type="button">Player: X</button> 
            <button id="o-button" type="button">Player: O</button>
        `;
        currentXCount.innerText = '0';
        currentOCount.innerText = '0';
        resetBoard();
        addStartScreenEventListeners();
    });
};

const getComputersTurn = (shape) => {
    setTimeout(() => {
        let emptyElements = elements.filter(el => !el.querySelector('.x-shape') && !el.querySelector('.o-shape'));
        if (emptyElements.length > 0) {
            let randomElement = emptyElements[Math.floor(Math.random() * emptyElements.length)];
            randomElement.innerHTML = `<div class="${shape}-shape"></div>`;
            randomElement.removeEventListener('click', updateId);
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            }
        }
    }, 500);
};

const getComputersTurnHard = (shape) => {
    setTimeout(() => {
        let emptyElements = elements.filter(el => !el.querySelector('.x-shape') && !el.querySelector('.o-shape'));

        // Check if the computer can win
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const elementA = elements[a].querySelector(`.${shape}-shape`);
            const elementB = elements[b].querySelector(`.${shape}-shape`);
            const elementC = elements[c].querySelector(`.${shape}-shape`);

            if (elementA && elementB && !elements[c].querySelector('.x-shape') && !elements[c].querySelector('.o-shape')) {
                elements[c].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[c].removeEventListener('click', updateId);
                return;
            } else if (elementA && elementC && !elements[b].querySelector('.x-shape') && !elements[b].querySelector('.o-shape')) {
                elements[b].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[b].removeEventListener('click', updateId);
                return;
            } else if (elementB && elementC && !elements[a].querySelector('.x-shape') && !elements[a].querySelector('.o-shape')) {
                elements[a].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[a].removeEventListener('click', updateId);
                return;
            }
        }

        // Block the player from winning
        const playerShape = shape === 'x' ? 'o' : 'x';
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const elementA = elements[a].querySelector(`.${playerShape}-shape`);
            const elementB = elements[b].querySelector(`.${playerShape}-shape`);
            const elementC = elements[c].querySelector(`.${playerShape}-shape`);

            if (elementA && elementB && !elements[c].querySelector('.x-shape') && !elements[c].querySelector('.o-shape')) {
                elements[c].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[c].removeEventListener('click', updateId);
                return;
            } else if (elementA && elementC && !elements[b].querySelector('.x-shape') && !elements[b].querySelector('.o-shape')) {
                elements[b].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[b].removeEventListener('click', updateId);
                return;
            } else if (elementB && elementC && !elements[a].querySelector('.x-shape') && !elements[a].querySelector('.o-shape')) {
                elements[a].innerHTML = `<div class="${shape}-shape"></div>`;
                elements[a].removeEventListener('click', updateId);
                return;
            }
        }

        // Choose a random move if no immediate win or block is possible
        if (emptyElements.length > 0) {
            let randomElement = emptyElements[Math.floor(Math.random() * emptyElements.length)];
            randomElement.innerHTML = `<div class="${shape}-shape"></div>`;
            randomElement.removeEventListener('click', updateId);
        }

        const roundWinner = getCurrentRoundWinner();
        if (roundWinner) {
            handleRoundEnd(roundWinner);
        }
    }, 500);
};

const updateId = (event) => {
    if (playerOptions.value === 'easy') {
        if (currentPlayer === 'x') {
            event.target.innerHTML = `<div class="x-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            } else {
                getComputersTurn('o');
            }
        } else {
            event.target.innerHTML = `<div class="o-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            } else {
                getComputersTurn('x');
            }
        }
    } else if (playerOptions.value === 'hard') {
        if (currentPlayer === 'x') {
            event.target.innerHTML = `<div class="x-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            } else {
                getComputersTurnHard('o');
            }
        } else {
            event.target.innerHTML = `<div class="o-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            } else {
                getComputersTurnHard('x');
            }
        }
    } else if (playerOptions.value === 'play with a friend') {
        if (currentPlayer === 'x') {
            event.target.innerHTML = `<div class="x-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            currentPlayer = 'o';
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            }
        } else {
            event.target.innerHTML = `<div class="o-shape"></div>`;
            event.target.removeEventListener('click', updateId);
            currentPlayer = 'x';
            const roundWinner = getCurrentRoundWinner();
            if (roundWinner) {
                handleRoundEnd(roundWinner);
            }
        }
    }
};

const handleRoundEnd = (roundWinner) => {
    if (roundWinner === 'Player x' || roundWinner === 'Player o') {
        if (roundWinner === 'Player x') {
            let updateCount = parseInt(currentXCount.innerText, 10) + 1;
            currentXCount.innerText = updateCount;
            if (updateCount === 3) {
                return winner('Player x');
            }
        } else {
            let updateCount = parseInt(currentOCount.innerText, 10) + 1;
            currentOCount.innerText = updateCount;
            if (updateCount === 3) {
                return winner('Player o');
            }
        }
        displayNextRoundScreen(roundWinner);
    } else if (roundWinner === 'draw') {
        displayNextRoundScreen('draw');
    }
};

const displayNextRoundScreen = (winner) => {
    setTimeout(() => {
        playgroundScreen.style.display = 'none';
        startScreen.style.display = 'block';
    }, 500);
    const message = winner === 'draw' ? "It's a draw!" : `${winner.toUpperCase()} wins the round!`;
    startScreen.innerHTML = `
        <div class="next-round-screen">
            <h2>${message}</h2>
            <button id="next-round-btn">Start next round</button>
        </div>
        `;
    document.getElementById('next-round-btn').addEventListener('click', () => {
        playgroundScreen.style.display = 'grid';
        startScreen.style.display = 'none';
        resetBoard();
    });
};

const addStartScreenEventListeners = () => {
    document.getElementById('x-button').addEventListener('click', () => {
        currentPlayer = 'x';
        gameDisplay.style.display = 'block';
        playgroundScreen.style.display = 'grid';
        startScreen.style.display = 'none';
        resetBoard();
    });

    document.getElementById('o-button').addEventListener('click', () => {
        currentPlayer = 'o';
        gameDisplay.style.display = 'block';
        playgroundScreen.style.display = 'grid';
        startScreen.style.display = 'none';
        resetBoard();
    });
};

elements.forEach(el => el.addEventListener('click', updateId));
addStartScreenEventListeners();