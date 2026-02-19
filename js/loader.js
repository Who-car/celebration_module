// Конфигурация строк
// const terminalLines = [
//     "INITIALIZING SYSTEM...",
//     "LOADING MODULES...",
//     "CHECKING FIREWALL...",
//     "CONNECTING TO SERVER...",
//     "ACCESS GRANTED"
// ];

const terminalLines = [
    "> INITIALIZING celebration_module.exe...",
    "> LOADING memes.dll... [████████░░] 80%",
    "> Checking if you've been good this year... ✓",
    "> COMPILING respect... [████████████] 100%",
    "> Bypassing 'no fun' firewall... ✓",
    "> ACCESS GRANTED. Happy February 23rd!"
];

const terminalText = document.querySelector('.terminal-text');
const instructionEl = document.createElement('div');
let lineIndex = 0;
let isStarted = false;

// Функция определения мобильного устройства
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
}

// Обновляем инструкцию при изменении размера окна
function updateInstruction() {
    if (isMobile()) {
        instructionEl.textContent = "👆 Нажмите в любом месте для старта";
    } else {
        instructionEl.textContent = "⌨️ Нажмите ENTER для старта";
    }
}

function typeLine() {
    if (lineIndex < terminalLines.length && !isStarted) {
        const p = document.createElement('div');
        p.textContent = terminalLines[lineIndex];
        p.style.setProperty('--i', lineIndex);
        terminalText.appendChild(p);
        
        lineIndex++;
        // Случайная задержка для "живого" эффекта
        setTimeout(typeLine, Math.random() * 400 + 200);
    } else if (lineIndex >= terminalLines.length && !isStarted) {
        // Показываем инструкцию после последней строки
        instructionEl.className = 'terminal-instruction';
        document.querySelector('.terminal-content').appendChild(instructionEl);
        updateInstruction();
        
        isStarted = true; // Флаг, что можно начинать
    }
}

// Функция запуска
function startLoader() {
    if (!isStarted) return; // Игнорируем нажатия до конца печати
    
    // Убираем инструкцию
    if (instructionEl.parentNode) {
        instructionEl.remove();
    }
    
    // Плавное исчезновение лоадера
    const loader = document.getElementById('terminal-loader');
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            initCaptcha(); // Модалка появится через 300мс
        }, 300);
    }, 500);
}

// 🔥 Функция полного сброса и перезапуска терминала
function resetAndRestartTerminal() {
    // Очищаем текст терминала
    terminalText.innerHTML = '';
    lineIndex = 0;
    isStarted = false;
    
    // Удаляем инструкцию если есть
    if (instructionEl.parentNode) {
        instructionEl.remove();
    }
    
    // Перезапускаем печать текста
    typeLine();
}

// 🔥 Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    typeLine();
    
    // Десктоп: ENTER
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && isStarted) {
            startLoader();
        }
    });
    
    // Мобайл / десктоп: тап/клик в любом месте
    document.addEventListener('click', () => {
        if (isStarted) {
            startLoader();
        }
    });
    
    // Отслеживаем изменение размера окна (поворот телефона)
    window.addEventListener('resize', updateInstruction);
});

window.resetAndRestartTerminal = resetAndRestartTerminal;