// 🔐 CAPTCHA В СТИЛЕ GOOGLE — ИСПРАВЛЕННАЯ ВЕРСИЯ
const PUZZLE_IMAGE = 'assets/captcha.png';
const COLS = 4;
const ROWS = 3; // Прямоугольная сетка 4x3
const PIECE_SIZE = 70;

let puzzleSolved = false;
let videoEnded = false;
let captchaInitialized = false; // 🔥 Флаг: инициализирована ли капча

function initCaptcha() {
    // 🔥 Защита от повторной инициализации
    if (captchaInitialized) return;
    captchaInitialized = true;
    
    // Показываем оверлей
    document.getElementById('captcha-overlay').classList.remove('hidden');
    
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    puzzleSolved = false;
    videoEnded = false;
    
    // Скрываем видео и успех, показываем пазл
    document.getElementById('puzzle-grid').style.display = 'grid';
    document.getElementById('captcha-video-container').classList.add('hidden');
    document.getElementById('captcha-success').classList.add('hidden');
    
    const pieces = [];
    
    // Создаём 12 кусочков (4x3)
    for (let i = 0; i < COLS * ROWS; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url(${PUZZLE_IMAGE})`;
        piece.style.backgroundSize = `${COLS * PIECE_SIZE}px ${ROWS * PIECE_SIZE}px`;
        
        // Позиция фона для этого кусочка
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        piece.style.backgroundPosition = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`;
        
        piece.dataset.index = i;
        
        // Случайный начальный поворот (0, 90, 180, 270)
        const randomRotation = Math.floor(Math.random() * 4) * 90;
        piece.dataset.rotation = randomRotation;
        piece.style.transform = `rotate(${randomRotation}deg)`;
        
        // 🔥 Важно: stopPropagation чтобы клик не всплывал выше
        piece.onclick = (e) => {
            e.stopPropagation();
            rotatePiece(piece);
        };
        
        pieces.push(piece);
    }
    
    // Добавляем в сетку (без перемешивания позиций!)
    pieces.forEach(p => grid.appendChild(p));
}

function rotatePiece(piece) {
    if (puzzleSolved) return;
    
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
        if (rotation !== 0) {
            isSolved = false;
        } else {
            piece.classList.add('correct');
        }
    });
    
    if (isSolved && !puzzleSolved) {
        puzzleSolved = true;
        setTimeout(() => {
            showVideo();
        }, 800);
    }
}

function showVideo() {
    // Скрываем пазл
    document.getElementById('puzzle-grid').style.display = 'none';
    
    // Показываем видео контейнер
    const videoContainer = document.getElementById('captcha-video-container');
    videoContainer.classList.remove('hidden');
    
    const video = document.getElementById('captcha-video');
    video.currentTime = 0;
    
    // 🔥 УБРАЛИ: .catch() с кнопкой "Воспроизвести" — если не играет, пусть будет тихо
    video.play().catch(err => {
        console.log('Autoplay blocked:', err);
        // Просто логируем, не показываем кнопку
    });
    
    video.onended = () => {
        videoEnded = true;
        showSuccess();
    };
}

function showSuccess() {
    document.getElementById('captcha-video-container').classList.add('hidden');
    document.getElementById('captcha-success').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('captcha-overlay').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        initGame();
    }, 2000);
}

function closeCaptcha() {
    // Скрываем капчу
    document.getElementById('captcha-overlay').classList.add('hidden');
    document.getElementById('game-container').classList.add('hidden');
    
    // 🔥 Показываем терминал
    const loader = document.getElementById('terminal-loader');
    loader.classList.remove('hidden');
    loader.style.opacity = '1'; // Убираем прозрачность если была
    
    // 🔥 Сбрасываем флаг капчи чтобы можно было пройти заново
    captchaInitialized = false;
    
    // 🔥 Перезапускаем терминал с начала
    resetAndRestartTerminal();
}

// 🔥 Блокируем клик по оверлею (чтобы не закрывался случайно)
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('captcha-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            // 🔥 Клик по оверлею НЕ закрывает капчу
            e.stopPropagation();
        });
    }
});