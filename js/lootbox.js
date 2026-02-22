const prizes = [
    { name: "RTX 5090", rarity: "legendary", img: "assets/rtx_5090.webp" },
    { name: "64GB RAM", rarity: "epic", img: "assets/ram_64.webp" },
    { name: "Аниме фигурка", rarity: "rare", img: "assets/figurka-anime.webp" },
    { name: "Протеин 100 кг", rarity: "rare", img: "assets/protein.webp" },
    { name: "Нож-бабочка", rarity: "legendary", img: "assets/knife.webp" },
    { name: "Тайный приз", rarity: "guaranteed", img: "assets/random.webp" }
];

// Зачем ты сюда смотришь? :)
const giftKeys = {
    "1": "DBFKE-VAR2K-HZZ3X",
    "2": "B8LL8-9ED5P-8Z85K",
    "3": "T74TV-DNIE2-BIL2Q",
    "4": "5TIGQ-MVC8R-VBIZY",
    "5": "DTCF2-EPH75-2996Y",
    "6": "GFCI0-FGD5A-DQR7Z",
    "8": "J5YX5-95X82-TW2X8",
    "9": "745JD-M9MZ2-KZTKI",
    "10": "9CMTD-FT29R-83T2M",
    "12": "J48EW-ATWGG-VL4XK",
    "13": "56N56-PFHDQ-02DQQ",
    "14": "BDE83-8V98D-NXQXZ",
    "15": "T2CKQ-DTJCF-RLDFY",
    "16": "779CF-DVI73-VII9B",
    "17": "H03M2-MBG58-ZEEX9",
    "19": "GHXFF-GVPY8-BCKQG",
    "20": "JK389-T5ZI3-5GERJ",
    "21": "GTP3L-KQ466-F883X",
    "24": "9367L-BI73E-DB57Z",
    "25": "HRGI3-WKXXC-VI0BB",
};

let finalAlreadyShown = false;

function openLootboxScene() {
    document.getElementById('congrats-modal').classList.add('hidden');
    document.getElementById('lootbox-scene').classList.remove('hidden');
    
    const itemsContainer = document.getElementById('lootbox-items');
    itemsContainer.innerHTML = '';

    // 🔥 Увеличиваем до 150 элементов (с запасом)
    const totalItems = 160;
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

    itemsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.loot-item');
        if (!item) return;

        if (finalAlreadyShown) {
            showFinalPrize();
        }
    });
    itemsContainer.classList.add('idle');
}

function spinLootbox() {
    const btn = document.getElementById('spin-btn');
    const itemsContainer = document.getElementById('lootbox-items');
    const lootbox = document.querySelector('.lootbox');
    
    btn.disabled = true;
    btn.textContent = "ОТКРЫВАЕМ...";

    // 1. Останавливаем idle-анимацию
    itemsContainer.classList.remove('idle');

    // 2. Зафиксировать текущую позицию
    const computedStyle = window.getComputedStyle(itemsContainer);
    const matrix = new DOMMatrix(computedStyle.transform);
    const currentX = matrix.m41;

    itemsContainer.style.animation = 'none';
    itemsContainer.style.transition = 'none';
    itemsContainer.style.transform = `translateX(${currentX}px)`;
    void itemsContainer.offsetWidth;

    // 4. Расчёт позиции остановки
    const item = itemsContainer.querySelector('.loot-item');
    const realItemWidth = item.offsetWidth + 10; // gap

    const targetIndex = parseInt(itemsContainer.dataset.targetIndex);
    const totalItems = parseInt(itemsContainer.dataset.totalItems);
    const extraSpins = 3;

    const lootboxWidth = lootbox.offsetWidth;
    const centerOffset = lootboxWidth / 2 - realItemWidth / 2;

    const targetX = -(
        targetIndex * realItemWidth
    ) + centerOffset;

    // 5. Запускаем анимацию с замедлением
    itemsContainer.style.transition = 'transform 5.5s cubic-bezier(0.15, 0.85, 0.30, 1.0)';
    itemsContainer.style.transform = `translateX(${targetX}px)`;

    // 6. 🔥 Увеличиваем задержку до 6000ms (чтобы совпадало с окончанием анимации)
    setTimeout(() => {
        showFinalPrize();
    }, 6000);
}

function showFinalPrize() {
    finalAlreadyShown = true;
    const lootboxScene = document.getElementById('lootbox-scene');
    const finalPrize = document.getElementById('final-prize');
    const img = finalPrize.querySelector('.certificate-img');
    const btn = finalPrize.querySelector('.get-prize-btn');
    const modalContent = finalPrize.querySelector('.modal-content');

    lootboxScene.classList.add('hidden');
    finalPrize.classList.remove('hidden');

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id && giftKeys[id]) {
        // если id найден

        img.src = "assets/random.webp";

        // удаляем кнопку если есть
        if (btn) btn.remove();
        
        // удалить старый key-box если существует
        const oldKeyBox = finalPrize.querySelector('.key-box');
        if (oldKeyBox) oldKeyBox.remove();

        // создаём поле для ключа
        const keyBox = document.createElement('div');
        keyBox.className = "key-box";
        keyBox.textContent = giftKeys[id];

        const toast = finalPrize.querySelector('.copy-toast');
        keyBox.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(giftKeys[id]);

                toast.classList.add('visible');

                setTimeout(() => {
                    toast.classList.remove('visible');
                }, 3000);

            } catch (e) {
                console.error("Clipboard error:", e);
            }
        });

        modalContent.appendChild(keyBox);

    } else {
        // если id не найден
        img.src = "assets/certificate.jpg";
        // кнопка остаётся как есть
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            finalPrize.classList.add('visible');
        });
    });
}

// 🔥 НОВАЯ функция для конфетти
function startFinalConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d', '#c44569']
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d', '#c44569']
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function closeFinalPrize() {
    const finalPrize = document.getElementById('final-prize');
    const lootboxScene = document.getElementById('lootbox-scene');
    const btn = document.getElementById('spin-btn');

    finalPrize.classList.remove('visible');

    setTimeout(() => {
        finalPrize.classList.add('hidden');
        lootboxScene.classList.remove('hidden');

        btn.textContent = "ЗАХОДИТЕ ЗАВТРА";
        btn.disabled = true;
    }, 500);
}