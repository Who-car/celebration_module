let canvas, ctx;
let gameLoopId;
let tank = { x: 50, y: 300, angle: 0, size: 30 };
let bullets = [];
let enemies = [];
let treasure = { x: 700, y: 250, size: 40, collected: false };
let walls = [];
let keys = {};

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Генерация стен
    walls = [
        { x: 200, y: 100, w: 20, h: 400 },
        { x: 400, y: 0, w: 20, h: 300 },
        { x: 400, y: 400, w: 20, h: 200 },
        { x: 600, y: 150, w: 20, h: 300 },
    ];
    
    // Управление
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    
    // Спавн врагов
    setInterval(() => {
        if(enemies.length < 5) {
            enemies.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                size: 25,
                speed: 1 + Math.random()
            });
        }
    }, 2000);
    
    gameLoop();
}

function update() {
    // Движение танка
    const speed = 3;
    if (keys['ArrowUp'] || keys['w']) tank.y -= speed;
    if (keys['ArrowDown'] || keys['s']) tank.y += speed;
    if (keys['ArrowLeft'] || keys['a']) { tank.x -= speed; tank.angle -= 0.05; }
    if (keys['ArrowRight'] || keys['d']) { tank.x += speed; tank.angle += 0.05; }
    
    // Стрельба
    if (keys[' '] && bullets.length < 3) {
        bullets.push({
            x: tank.x, y: tank.y,
            vx: Math.cos(tank.angle) * 8,
            vy: Math.sin(tank.angle) * 8,
            life: 100
        });
        keys[' '] = false; // Чтобы не стрелял зажимом
    }
    
    // Пули
    bullets.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.life--;
    });
    bullets = bullets.filter(b => b.life > 0);
    
    // Враги (простое преследование)
    enemies.forEach(e => {
        const angle = Math.atan2(tank.y - e.y, tank.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;
    });
    
    // Проверка победы (сокровище)
    const dist = Math.hypot(tank.x - treasure.x, tank.y - treasure.y);
    if (dist < treasure.size && !treasure.collected) {
        treasure.collected = true;
        endGame();
    }
}

function draw() {
    // Очистка
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Стены
    ctx.fillStyle = '#4a4a6a';
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));
    
    // Сокровище
    if (!treasure.collected) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(treasure.x, treasure.y, treasure.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffd700';
    }
    
    // Танк
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-15, -15, 30, 30);
    ctx.fillRect(0, -5, 25, 10);
    ctx.restore();
    
    // Враги
    ctx.fillStyle = '#ff0000';
    enemies.forEach(e => ctx.fillRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size));
    
    // Пули
    ctx.fillStyle = '#ffff00';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.shadowBlur = 0;
}

function gameLoop() {
    update();
    draw();
    if (!treasure.collected) {
        gameLoopId = requestAnimationFrame(() => gameLoop());
    }
}

function endGame() {
    cancelAnimationFrame(gameLoopId);
    showCongratulations();
}