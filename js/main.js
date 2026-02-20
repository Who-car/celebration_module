const congratulationsMap = {
    default: { 
        subtext: "ЗАЩИТНИК КОДА И ПОВЕЛИТЕЛЬ БАГОВ",
        img: 'assets/card_1.gif'
    },
    "1": {
        subtext: "Поздравления Кирилла",
        img: 'assets/card_2.jpg'
    },
    "2": {
        subtext: "Поздравление Димы",
        img: 'assets/card_3.jpg'
    },
    "3": {
        subtext: "Поздравление Максима А",
        img: 'assets/card_4.jpg'
    },
    "4": { 
        subtext: "Поздравление Андрея",
        img: 'assets/card_1.gif'
    },
    "5": {
        subtext: "Поздравления Максима Б",
        img: 'assets/card_2.jpg'
    },
    "6": {
        subtext: "Поздравление Антона",
        img: 'assets/card_3.jpg'
    },
    "8": {
        subtext: "Поздравление Рузана",
        img: 'assets/card_4.jpg'
    },
    "9": {
        subtext: "Поздравления Ильнара",
        img: 'assets/card_1.gif'
    },
    "10": {
        subtext: "Поздравление Амира",
        img: 'assets/card_2.jpg'
    },
    "12": {
        subtext: "Поздравление Егора",
        img: 'assets/card_3.jpg'
    },
    "13": { 
        subtext: "Поздравление Азата",
        img: 'assets/card_4.jpg'
    },
    "14": {
        subtext: "Поздравления Нияза",
        img: 'assets/card_1.gif'
    },
    "15": {
        subtext: "Поздравление Никиты",
        img: 'assets/card_2.jpg'
    },
    "16": {
        subtext: "Поздравление Максима Л",
        img: 'assets/card_3.jpg'
    },
    "17": {
        subtext: "Поздравление Айдара",
        img: 'assets/card_4.jpg'
    },
    "19": {
        subtext: "Поздравление Ахмеда",
        img: 'assets/card_1.gif'
    },
    "20": { 
        subtext: "Поздравление Матвея",
        img: 'assets/card_2.jpg'
    },
    "21": {
        subtext: "Поздравления Тимура",
        img: 'assets/card_3.jpg'
    },
    "24": {
        subtext: "Поздравление Камила",
        img: 'assets/card_4.jpg'
    },
    "25": {
        subtext: "Поздравление Алмаза",
        img: 'assets/card_1.gif'
    },
};

// 🔧 ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: получение query-параметров
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 🔧 ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: получение поздравления по ID
function getCongratulationsById(id) {
    // Если ID есть в словаре — возвращаем его, иначе — дефолтное
    return congratulationsMap[id] || congratulationsMap.default;
}

const confettiInterval = null; // Инициализация (будет перезаписана)

function showCongratulations() {
    // 1️⃣ Достаём id из query-параметров
    const congratsId = getUrlParameter('id');
    
    // 2️⃣ Получаем данные поздравления по ID (или дефолтные)
    const congratsData = getCongratulationsById(congratsId);
    
    // 3️⃣ Устанавливаем контент
    document.getElementById('congrats-img').src = congratsData.img;
    document.getElementById('congrats-text').innerHTML = `
        <h1 class="retro-title">С 23 ФЕВРАЛЯ!</h1>
        <p class="retro-subtitle">${congratsData.subtext}</p>
    `;
    
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('congrats-modal').classList.remove('hidden');
    
    // 🔥 ЗАПУСКАЕМ ПОСТОЯННОЕ КОНФЕТТИ
    startContinuousConfetti();
}

function startContinuousConfetti() {
    // Очищаем предыдущий интервал если есть
    if (window.confettiInterval) {
        clearInterval(window.confettiInterval);
    }
    
    // Запускаем конфетти каждые 300мс
    window.confettiInterval = setInterval(() => {
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
    if (window.confettiInterval) {
        clearInterval(window.confettiInterval);
        window.confettiInterval = null;
    }
}