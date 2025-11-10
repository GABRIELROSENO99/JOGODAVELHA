const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const colorPicker = document.getElementById('color-picker');
const symbolXSelect = document.getElementById('symbol-x-select');
const symbolOSelect = document.getElementById('symbol-o-select');

let gameActive = true;
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""]; // Representa o tabuleiro
let scoreX = 0;
let scoreO = 0;
let currentSymbolX = 'X'; // Pode ser 'X' ou '▲'
let currentSymbolO = 'O'; // Pode ser 'O' ou '♥'

// Combinações de vitória (índices das células)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// --- Funções de Lógica do Jogo ---

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handlePlay(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handlePlay(clickedCell, clickedCellIndex) {
    const symbol = currentPlayer === 'X' ? currentSymbolX : currentSymbolO;
    
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = symbol;
    
    // Define a cor de exibição do símbolo
    if (currentPlayer === 'X') {
        clickedCell.style.color = '#00bcd4'; // Cor para X/Triângulo (Dark Mode Primary)
        // Se o símbolo for '▲' (Triângulo) e o background for escuro, o azul pode ficar melhor
        if (currentSymbolX === '▲') {
             clickedCell.style.color = '#4caf50'; // Ex: um verde para diferenciar
        }
    } else {
        clickedCell.style.color = '#ff9800'; // Cor para O/Coração (Dark Mode Accent)
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        let winMessage;
        
        if (currentPlayer === 'X') {
            // Verifica o símbolo real do Jogador X (X ou Triângulo)
            if (currentSymbolX === '▲') {
                winMessage = `🎉 O TRIÂNGULO VENCEU! 👟 O GUILHERME VAI TER QUE LAVAR MEU TÊNIS!`;
            } else {
                winMessage = `🎉 Vitória do Símbolo X! O almoço será por conta do Gui !!!`;
            }
        } else {
            // Verifica o símbolo real do Jogador O (O ou Coração)
            if (currentSymbolO === '♥') {
                winMessage = `O CORAÇÃO VENCEU! 🎉 O GUILHERME VAI PAGAR UM SORVETE PRA MIM!`;
            } else {
                winMessage = `🏆 CÍRCULO VENCEU! GUI terá que fazer faxina em casa !`;
            }
        }

        statusDisplay.innerHTML = winMessage;
        gameActive = false;
        updateScore(currentPlayer);
        return;
    }

    // Verifica empate
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = `Empate!`;
        gameActive = false;
        return;
    }

    // Muda o jogador
    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `Vez do ${currentPlayer}`;
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = `Vez do ${currentSymbolX}`; // Mostra o símbolo atual do X
    
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.style.color = '';
        // Remove cores específicas dos símbolos
        if (cell.classList.contains('x-win')) cell.classList.remove('x-win');
        if (cell.classList.contains('o-win')) cell.classList.remove('o-win');
    });
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        scoreXDisplay.innerHTML = `${currentSymbolX}: ${scoreX}`;
    } else {
        scoreO++;
        scoreODisplay.innerHTML = `${currentSymbolO}: ${scoreO}`;
    }
}

// --- Funções de Personalização ---

function handleColorChange(event) {
    const newColor = event.target.value;
    document.documentElement.style.setProperty('--board-color', newColor);
}

function handleSymbolChange() {
    currentSymbolX = symbolXSelect.value;
    currentSymbolO = symbolOSelect.value;
    
    // Reinicia o placar para refletir os novos símbolos
    scoreX = 0;
    scoreO = 0;
    scoreXDisplay.innerHTML = `${currentSymbolX}: ${scoreX}`;
    scoreODisplay.innerHTML = `${currentSymbolO}: ${scoreO}`;

    // Atualiza o status inicial e reinicia o tabuleiro
    statusDisplay.innerHTML = `Vez do ${currentSymbolX}`;
    handleRestartGame();
}

// --- Configuração Inicial e Event Listeners ---

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);
colorPicker.addEventListener('input', handleColorChange);
symbolXSelect.addEventListener('change', handleSymbolChange);
symbolOSelect.addEventListener('change', handleSymbolChange);

// Configuração inicial
const defaultColor = colorPicker.value;
document.documentElement.style.setProperty('--board-color', defaultColor);
scoreXDisplay.innerHTML = `${currentSymbolX}: ${scoreX}`;
scoreODisplay.innerHTML = `${currentSymbolO}: ${scoreO}`;
statusDisplay.innerHTML = `Vez do ${currentSymbolX}`;
