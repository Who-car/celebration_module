const congratulations = [
    { text: "С 23 февраля! Ты настоящий защитник кода!", img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500" },
    { text: "Без тебя наш код бы не выжил!", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500" },
    { text: "Желаем меньше багов и больше деплоев!", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500" }
];

function showCongratulations() {
    const congrats = congratulations[Math.floor(Math.random() * congratulations.length)];
    
    document.getElementById('congrats-img').src = congrats.img;
    document.getElementById('congrats-text').textContent = congrats.text;
    
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('congrats-modal').classList.remove('hidden');
    
    // Запуск конфетти
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}