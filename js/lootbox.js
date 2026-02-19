const prizes = [
    { name: "RTX 5090", rarity: "legendary", img: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png" },
    { name: "64GB RAM", rarity: "epic", img: "https://cdn-icons-png.flaticon.com/512/2886/2886699.png" },
    { name: "Аниме фигурка", rarity: "rare", img: "https://cdn-icons-png.flaticon.com/512/3406/3406829.png" },
    { name: "СЕРТИФИКАТ", rarity: "guaranteed", img: "https://cdn-icons-png.flaticon.com/512/2913/2913517.png" }
];

function openLootboxScene() {
    document.getElementById('congrats-modal').classList.add('hidden');
    document.getElementById('lootbox-scene').classList.remove('hidden');
    
    const itemsContainer = document.getElementById('lootbox-items');
    itemsContainer.innerHTML = '';
    
    // Генерируем 50 предметов
    for (let i = 0; i < 50; i++) {
        // На 48-й позиции гарантированно сертификат
        const prize = (i === 48) ? prizes[3] : prizes[Math.floor(Math.random() * 3)];
        
        const item = document.createElement('div');
        item.className = `loot-item ${prize.rarity}`;
        item.innerHTML = `
            <img src="${prize.img}" alt="${prize.name}">
            <span>${prize.name}</span>
        `;
        itemsContainer.appendChild(item);
    }
}

function spinLootbox() {
    const btn = document.getElementById('spin-btn');
    const itemsContainer = document.getElementById('lootbox-items');
    const itemWidth = 160; // 140px ширина + 20px отступы
    
    btn.disabled = true;
    btn.textContent = "ОТКРЫВАЕМ...";
    
    // Вычисляем смещение, чтобы 48-й элемент встал по центру
    // 48 * 160 = 7680px
    const targetPosition = 48 * itemWidth;
    
    itemsContainer.style.transition = 'transform 3s cubic-bezier(0.15, 0.9, 0.3, 1)';
    itemsContainer.style.transform = `translateX(-${targetPosition}px)`;
    
    setTimeout(() => {
        showFinalPrize();
    }, 3500);
}

function showFinalPrize() {
    document.getElementById('lootbox-scene').classList.add('hidden');
    document.getElementById('final-prize').classList.remove('hidden');
    
    // Конфетти
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}