// Ссылка на картинку-загадку (замени на свою)
const PUZZLE_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'; 
const GRID_SIZE = 4;
const PIECE_SIZE = 80;

function initCaptcha() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    
    // Создаем 16 кусочков
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url(${PUZZLE_IMAGE})`;
        piece.style.backgroundSize = `${GRID_SIZE * PIECE_SIZE}px`;
        
        // Вычисляем позицию фона для этого кусочка
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        piece.style.backgroundPosition = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`;
        
        piece.dataset.index = i; // Правильный индекс (не меняется!)
        
        // случайный начальный поворот вместо перемешивания
        const randomRotation = Math.floor(Math.random() * 4) * 90; // 0, 90, 180 или 270
        piece.dataset.rotation = randomRotation;
        piece.style.transform = `rotate(${randomRotation}deg)`;
        
        piece.onclick = () => rotatePiece(piece);
        
        grid.appendChild(piece); // Добавляем сразу, без перемешивания!
    }
}

function rotatePiece(piece) {
    let rotation = parseInt(piece.dataset.rotation) + 90;
    piece.dataset.rotation = rotation;
    piece.style.transform = `rotate(${rotation}deg)`;
    
    checkSolution();
}

function checkSolution() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let isSolved = true;
    
    pieces.forEach(piece => {
        const rotation = parseInt(piece.dataset.rotation) % 360;
        if (rotation !== 0) isSolved = false;
    });
    
    if (isSolved) {
        setTimeout(() => {
            document.getElementById('captcha-container').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            initGame(); // Запускаем игру из game.js
        }, 500);
    }
}

// Алгоритм перемешивания Фишера-Йетса
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}