// Конфигурация строк
const terminalLines = [
    "INITIALIZING SYSTEM...",
    "LOADING MODULES...",
    "CHECKING FIREWALL...",
    "CONNECTING TO SERVER...",
    "ACCESS GRANTED"
];

const terminalText = document.querySelector('.terminal-text');
let lineIndex = 0;

function typeLine() {
    if (lineIndex < terminalLines.length) {
        // Добавляем строку
        const p = document.createElement('div');
        p.textContent = "> " + terminalLines[lineIndex];
        terminalText.appendChild(p);
        
        lineIndex++;
        // Случайная задержка для реалистичности
        setTimeout(typeLine, Math.random() * 500 + 300);
    } else {
        // Когда всё напечатано
        setTimeout(() => {
            document.getElementById('terminal-loader').classList.add('hidden');
            document.getElementById('captcha-container').classList.remove('hidden');
            initCaptcha(); // Запускаем капчу из captcha.js
        }, 1000);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', typeLine);