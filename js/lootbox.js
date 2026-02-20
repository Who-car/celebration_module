const prizes = [
    { name: "RTX 5090", rarity: "legendary", img: "assets/rtx_5090.png" },
    { name: "64GB RAM", rarity: "epic", img: "assets/ram_64.png" },
    { name: "Аниме фигурка", rarity: "rare", img: "assets/figurka-anime.png" },
    { name: "Протеин 100 кг", rarity: "rare", img: "assets/protein.png" },
    { name: "Нож-бабочка", rarity: "legendary", img: "assets/knife.png" },
    { name: "Тайный приз", rarity: "guaranteed", img: "assets/certificate.png" }
];

function openLootboxScene() {
    document.getElementById('congrats-modal').classList.add('hidden');
    document.getElementById('lootbox-scene').classList.remove('hidden');
    
    const itemsContainer = document.getElementById('lootbox-items');
    itemsContainer.innerHTML = '';

    // 🔥 Увеличиваем до 150 элементов (с запасом)
    const totalItems = 150;
    const guaranteedIndex = 110;

    for (let i = 0; i < totalItems; i++) {
        let prize;

        if (i === guaranteedIndex) {
            prize = prizes[5]; // гарантированный
        }
        else if (i === guaranteedIndex - 1) {
            prize = prizes[0]; // легендарка перед финалом
        }
        else if (i === guaranteedIndex - 2) {
            prize = prizes[1]; // эпик перед финалом
        }
        else {
            prize = prizes[Math.floor(Math.random() * 4)];
        }

        const item = document.createElement('div');
        item.className = `loot-item ${prize.rarity}`;
        item.innerHTML = `
            <img src="${prize.img}" alt="${prize.name}">
            <span>${prize.name}</span>
        `;
        itemsContainer.appendChild(item);
    }

    itemsContainer.dataset.targetIndex = guaranteedIndex;
    itemsContainer.dataset.totalItems = totalItems;
}

function spinLootbox() {
    const btn = document.getElementById('spin-btn');
    const itemsContainer = document.getElementById('lootbox-items');

    btn.disabled = true;
    btn.textContent = "ОТКРЫВАЕМ...";

    // 1. Останавливаем idle-анимацию
    itemsContainer.style.animation = 'none';
    
    // 2. Считываем текущее положение
    const computedStyle = window.getComputedStyle(itemsContainer);
    const matrix = new DOMMatrix(computedStyle.transform);
    const currentX = matrix.m41;

    // 3. Фиксируем текущую позицию
    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = `translateX(${currentX}px)`;
    void itemsContainer.offsetWidth; // reflow

    // 4. Расчёт позиции остановки
    const itemWidth = 140 + 10; // ширина предмета (140px) + gap (10px) из CSS
    const targetIndex = parseInt(itemsContainer.dataset.targetIndex); // 110
    const extraSpins = 3; // количество полных прокруток перед остановкой

    // 🔥 Важно: не выходим за пределы созданных элементов
    const maxScrollIndex = parseInt(itemsContainer.dataset.totalItems) - 5;
    const safeTargetIndex = Math.min(targetIndex, maxScrollIndex);

    // Целевая позиция (отрицательная, так как двигаем влево)
    const targetX = currentX - ((safeTargetIndex + extraSpins * 12) * itemWidth);

    // 5. Запускаем анимацию с замедлением
    itemsContainer.style.transition = 'transform 5.5s cubic-bezier(0.15, 0.85, 0.30, 1.0)';
    itemsContainer.style.transform = `translateX(${targetX}px)`;

    // 6. Показываем приз после завершения
    setTimeout(() => {
        showFinalPrize();
    }, 5800);
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