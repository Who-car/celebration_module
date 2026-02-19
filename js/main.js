// 🎉 ПОЗДРАВЛЕНИЯ

const congratulations = [
    { 
        text: "С 23 ФЕВРАЛЯ!",
        subtext: "ЗАЩИТНИК КОДА И ПОВЕЛИТЕЛЬ БАГОВ"
    }
];

const cards = [
    'assets/card_1.gif',
    'assets/card_2.jpg',
    'assets/card_3.jpg',
    'assets/card_4.jpg'
];

let confettiInterval = null;

function showCongratulations() {
    // Выбираем случайную открытку
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const congrats = congratulations[0];
    
    // Устанавливаем контент
    document.getElementById('congrats-img').src = randomCard;
    document.getElementById('congrats-text').innerHTML = `
        <h1 class="retro-title">${congrats.text}</h1>
        <p class="retro-subtitle">${congrats.subtext}</p>
    `;
    
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('congrats-modal').classList.remove('hidden');
    
    // 🔥 ЗАПУСКАЕМ ПОСТОЯННОЕ КОНФЕТТИ
    startContinuousConfetti();
}

function startContinuousConfetti() {
    // Очищаем предыдущий интервал если есть
    if (confettiInterval) {
        clearInterval(confettiInterval);
    }
    
    // Запускаем конфетти каждые 300мс
    confettiInterval = setInterval(() => {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d', '#c44569']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d', '#c44569']
        });
    }, 300);
}

function stopConfetti() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
}

// Останавливаем конфетти при переходе к лутбоксу
window.openLootboxScene = function() {
    stopConfetti();
    
    document.getElementById('congrats-modal').classList.add('hidden');
    document.getElementById('lootbox-scene').classList.remove('hidden');
    
    // Генерируем ленту предметов
    const itemsContainer = document.getElementById('lootbox-items');
    itemsContainer.innerHTML = '';
    
    // Генерируем 50 предметов
    for (let i = 0; i < 50; i++) {
        const prize = (i === 48) ? prizes[3] : prizes[Math.floor(Math.random() * 3)];
        
        const item = document.createElement('div');
        item.className = `loot-item ${prize.rarity}`;
        item.innerHTML = `
            <img src="${prize.img}" alt="${prize.name}">
            <span>${prize.name}</span>
        `;
        itemsContainer.appendChild(item);
    }
};