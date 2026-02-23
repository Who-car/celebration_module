// 🎮 TANK GAME - Battle City Style v2.0

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 🔧 НАСТРОЙКИ ИГРЫ
const TILE_SIZE = 32;
// Увеличенная карта 19x19 (больше пространства как в аркадном Battle City)
const GRID_WIDTH = 19;
const GRID_HEIGHT = 19;
canvas.width = GRID_WIDTH * TILE_SIZE;
canvas.height = GRID_HEIGHT * TILE_SIZE;

// 🎯 ИГРОВЫЕ ПАРАМЕТРЫ
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const valid_ids = ["1", "2", "3", "4", "5", "6", "8", "9", "10", "12", "13", "14", "15", "16", "17", "19", "20", "21", "24", "25"];
const WIN_SCORE = valid_ids.includes(id) ? 1000 : 100;
const POINTS_PER_ENEMY = 100;

// 📦 ЗАГРУЗКА АССЕТОВ
const assets = {
    // Игрок
    player_top_A: new Image(),
    player_top_B: new Image(),
    player_bottom_A: new Image(),
    player_bottom_B: new Image(),
    player_left_A: new Image(),
    player_left_B: new Image(),
    player_right_A: new Image(),
    player_right_B: new Image(),
    
    // Враги
    enemy_top_A: new Image(),
    enemy_top_B: new Image(),
    enemy_bottom_A: new Image(),
    enemy_bottom_B: new Image(),
    enemy_left_A: new Image(),
    enemy_left_B: new Image(),
    enemy_right_A: new Image(),
    enemy_right_B: new Image(),
    
    // Стены
    brick_ok: new Image(),
    brick_top: new Image(),
    brick_bottom: new Image(),
    brick_left: new Image(),
    brick_right: new Image(),
    steel_ok: new Image(),
    steel_top: new Image(),
    steel_bottom: new Image(),
    steel_left: new Image(),
    steel_right: new Image(),
    
    // Пули
    bullet_top: new Image(),
    bullet_bottom: new Image(),
    bullet_left: new Image(),
    bullet_right: new Image(),
    
    // База
    flag: new Image(),
    
    // Эффекты
    star_A: new Image(),
    star_B: new Image(),
    star_C: new Image(),
    star_D: new Image()
};

// Загружаем все ассеты
function loadAssets() {
    const basePath = 'assets/game/';
    
    // Игрок
    assets.player_top_A.src = basePath + 'player_tank_top_A.png';
    assets.player_top_B.src = basePath + 'player_tank_top_B.png';
    assets.player_bottom_A.src = basePath + 'player_tank_bottom_A.png';
    assets.player_bottom_B.src = basePath + 'player_tank_bottom_B.png';
    assets.player_left_A.src = basePath + 'player_tank_left_A.png';
    assets.player_left_B.src = basePath + 'player_tank_left_B.png';
    assets.player_right_A.src = basePath + 'player_tank_right_A.png';
    assets.player_right_B.src = basePath + 'player_tank_right_B.png';
    
    // Враги
    assets.enemy_top_A.src = basePath + 'enemy_tank_top_A.png';
    assets.enemy_top_B.src = basePath + 'enemy_tank_top_B.png';
    assets.enemy_bottom_A.src = basePath + 'enemy_tank_bottom_A.png';
    assets.enemy_bottom_B.src = basePath + 'enemy_tank_bottom_B.png';
    assets.enemy_left_A.src = basePath + 'enemy_tank_left_A.png';
    assets.enemy_left_B.src = basePath + 'enemy_tank_left_B.png';
    assets.enemy_right_A.src = basePath + 'enemy_tank_right_A.png';
    assets.enemy_right_B.src = basePath + 'enemy_tank_right_B.png';
    
    // Стены
    assets.brick_ok.src = basePath + 'breakable_wall_ok.png';
    assets.brick_top.src = basePath + 'breakable_wall_top.png';
    assets.brick_bottom.src = basePath + 'breakable_wall_bottom.png';
    assets.brick_left.src = basePath + 'breakable_wall_left.png';
    assets.brick_right.src = basePath + 'breakable_wall_right.png';
    assets.steel_ok.src = basePath + 'unbreakable_wall_ok.png';
    assets.steel_top.src = basePath + 'unbreakable_wall_top.png';
    assets.steel_bottom.src = basePath + 'unbreakable_wall_bottom.png';
    assets.steel_left.src = basePath + 'unbreakable_wall_left.png';
    assets.steel_right.src = basePath + 'unbreakable_wall_right.png';
    
    // Пули
    assets.bullet_top.src = basePath + 'bullet_top.png';
    assets.bullet_bottom.src = basePath + 'bullet_bottom.png';
    assets.bullet_left.src = basePath + 'bullet_left.png';
    assets.bullet_right.src = basePath + 'bullet_right.png';
    
    // База
    assets.flag.src = basePath + 'flag.png';
    
    // Эффекты
    assets.star_A.src = basePath + 'star_A.png';
    assets.star_B.src = basePath + 'star_B.png';
    assets.star_C.src = basePath + 'star_C.png';
    assets.star_D.src = basePath + 'star_D.png';
}

// 🗺️ КАРТА (0=пусто, 1=кирпич, 2=сталь, 3=база)
// Более крупная и разнообразная карта 19x19
const MAP = [
    //       0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
    /* 0 */ [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
    /* 1 */ [0,1,1,0,2,0,1,1,1,0,1,1,1,0,2,0,1,1,0],
    /* 2 */ [0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0],
    /* 3 */ [0,1,0,1,1,1,0,1,0,2,0,1,0,1,1,1,0,1,0],
    /* 4 */ [2,2,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,2,2],
    /* 5 */ [0,1,0,1,0,0,0,1,1,0,1,1,0,0,0,1,0,1,0],
    /* 6 */ [0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,1,0],
    /* 7 */ [0,1,1,1,0,0,1,1,0,2,0,1,1,0,0,1,1,1,0],
    /* 8 */ [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    /* 9 */ [0,1,0,1,0,2,0,1,0,0,0,1,0,2,0,1,0,1,0],
    /*10 */ [0,1,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,1,0],
    /*11 */ [0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,1,1,0],
    /*12 */ [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
    /*13 */ [0,1,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0],
    /*14 */ [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
    /*15 */ [0,1,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,1,0],
    /*16 */ [0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0],
    /*17 */ [0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0],
    /*18 */ [0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0]
];

// Игровые объекты
let walls = [];
let player = null;
let enemies = [];
let bullets = [];
let base = null;
let gameRunning = false;
let score = 0;
let animationFrame = 0;

// 🔥 Инициализация управления
const keys = {};
let controlsInitialized = false;

// 🎮 КЛАССЫ

class Wall {
    constructor(x, y, type, gridX, gridY) {
        this.x = x;
        this.y = y;
        this.type = type; // 1=brick, 2=steel
        this.gridX = gridX;
        this.gridY = gridY;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.destroyed = false;
        this.damage = { top: false, bottom: false, left: false, right: false };
        this.hp = this.type === 1 ? 2 : Infinity;
    }

    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    
    getSprite() {
        if (this.destroyed) return null;
        
        // Определяем префикс по типу стены
        const prefix = this.type === 1 ? 'brick' : 'steel';
        
        // Определяем какое повреждение
        let hasTop = this.damage.top;
        let hasBottom = this.damage.bottom;
        let hasLeft = this.damage.left;
        let hasRight = this.damage.right;
        
        // Формируем ключ для спрайта
        let spriteKey = prefix + '_ok';
        
        if (hasTop) spriteKey = prefix + '_top';
        else if (hasBottom) spriteKey = prefix + '_bottom';
        else if (hasLeft) spriteKey = prefix + '_left';
        else if (hasRight) spriteKey = prefix + '_right';
        
        // Возвращаем спрайт из assets
        return assets[spriteKey];
    }
    
    draw() {
        if (this.destroyed) return;
        const sprite = this.getSprite();
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, this.x, this.y, TILE_SIZE, TILE_SIZE);
        } else {
            // Fallback если картинка не загрузилась
            ctx.fillStyle = this.type === 1 ? '#b85c38' : '#888888';
            ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
        }
    }
    
    hit(direction) {
        if (this.type === 2) return false;

        this.hp--;

        // для визуала можно оставить повреждение одной стороны
        if (direction === 'top') this.damage.top = true;
        else if (direction === 'bottom') this.damage.bottom = true;
        else if (direction === 'left') this.damage.left = true;
        else if (direction === 'right') this.damage.right = true;

        if (this.hp <= 0) {
            this.destroyed = true;
        }

        return true;
    }
}

class Tank {
    constructor(x, y, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.speed = isPlayer ? 2 : 1.5;
        this.direction = 0; // 0=top, 1=right, 2=bottom, 3=left
        this.isPlayer = isPlayer;
        this.cooldown = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.alive = true;

        this.moveTimer = 0;
        this.moveInterval = isPlayer ? 0 : 3;
        this.directionChangeTimer = 0;
        this.minDirectionTime = 120;
        this.fireChance = 0.003;
        this.stuckCounter = 0;
    }

    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    
    getSprite() {
        const prefix = this.isPlayer ? 'player' : 'enemy';
        const anim = this.animationFrame === 0 ? 'A' : 'B';
        const dirs = ['top', 'right', 'bottom', 'left'];
        const key = `${prefix}_${dirs[this.direction]}_${anim}`;
        return assets[key];
    }
    
    move(dx, dy) {
        if (dx > 0) this.direction = 1;
        else if (dx < 0) this.direction = 3;
        else if (dy > 0) this.direction = 2;
        else if (dy < 0) this.direction = 0;

        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;
        
        if (!this.checkCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
            
            // Анимация
            this.animationTimer++;
            if (this.animationTimer > 10) {
                this.animationFrame = this.animationFrame === 0 ? 1 : 0;
                this.animationTimer = 0;
            }
            
            return true; // Удалось двигаться
        }
        return false; // Не удалось
    }
    
    checkCollision(x, y) {
        // Границы карты
        if (x < 0 || x + this.width > canvas.width) return true;
        if (y < 0 || y + this.height > canvas.height) return true;

        const padding = this.isPlayer ? 2 : 0;
        
        const tankRect = { 
            left: x + padding, 
            right: x + this.width - padding, 
            top: y + padding, 
            bottom: y + this.height 
        };
        
        // Стены
        for (let wall of walls) {
            if (wall.destroyed) continue;
            if (rectIntersect(tankRect, wall)) return true;
        }
        
        // Другие танки
        const others = this.isPlayer ? 
            enemies.filter(e => e.alive) : 
            [player, ...enemies.filter(e => e !== this && e.alive)];
        
        for (let other of others) {
            if (other && other.alive && rectIntersect(tankRect, other)) return true;
        }
        
        return false;
    }
    
    shoot() {
        if (this.cooldown > 0) return;
        
        let bx = this.x + this.width / 2 - 8;
        let by = this.y + this.height / 2 - 8;
        let bvx = 0, bvy = 0;
        
        switch(this.direction) {
            case 0: by = this.y - 16; bvy = -6; break;
            case 1: bx = this.x + this.width; bvx = 6; break;
            case 2: by = this.y + this.height; bvy = 6; break;
            case 3: bx = this.x - 16; bvx = -6; break;
        }
        
        bullets.push(new Bullet(bx, by, bvx, bvy, this.isPlayer, this.direction));
        this.cooldown = 20;
    }
    
    update() {
        if (this.cooldown > 0) this.cooldown--;
        
        // 🔥 Логика движения для врагов
        if (!this.isPlayer && this.alive) {
            this.moveTimer++;
            this.directionChangeTimer++;

            if (this.moveTimer >= this.moveInterval) {
                this.moveTimer = 0;

                const dirs = [
                    {dx: 0, dy: -1},
                    {dx: 1, dy: 0},
                    {dx: 0, dy: 1},
                    {dx: -1, dy: 0}
                ];

                const dir = dirs[this.direction];
                const moved = this.move(dir.dx, dir.dy);

                if (!moved) {
                    this.stuckCounter++;
                } else {
                    this.stuckCounter = 0;
                }

                // Меняем направление только если:
                // - долго ехали
                // - реально застряли
                if (this.directionChangeTimer > this.minDirectionTime || this.stuckCounter > 10) {
                    let attempts = 0;
                    let newDirection;

                    do {
                        newDirection = Math.floor(Math.random() * 4);
                        attempts++;
                    } while (attempts < 10 && !this.canMoveInDirection(newDirection));

                    this.direction = newDirection;
                    this.directionChangeTimer = 0;
                    this.stuckCounter = 0;
                }
            }

            // Реже стреляем
            if (Math.random() < this.fireChance) {
                this.shoot();
            }
        }
    }
    
    draw() {
        if (!this.alive) return;
        const sprite = this.getSprite();
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback
            ctx.fillStyle = this.isPlayer ? '#90ee90' : '#ff6b6b';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    canMoveInDirection(dirIndex) {
        const dirs = [
            {dx: 0, dy: -1},
            {dx: 1, dy: 0},
            {dx: 0, dy: 1},
            {dx: -1, dy: 0}
        ];
        const dir = dirs[dirIndex];
        const newX = this.x + dir.dx * this.speed;
        const newY = this.y + dir.dy * this.speed;
        return !this.checkCollision(newX, newY);
    }
}

class Bullet {
    constructor(x, y, vx, vy, fromPlayer, direction) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 16;
        this.height = 16;
        this.fromPlayer = fromPlayer;
        this.direction = direction;
        this.active = true;
    }

    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    
    getSprite() {
        const dirs = ['top', 'right', 'bottom', 'left'];
        return assets['bullet_' + dirs[this.direction]];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Выход за границы
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.active = false;
            return;
        }
        
        const bulletRect = { 
            left: this.x, 
            right: this.x + this.width, 
            top: this.y, 
            bottom: this.y + this.height 
        };
        
        // Столкновение со стенами
        for (let wall of walls) {
            if (wall.destroyed) continue;
            if (rectIntersect(bulletRect, wall)) {
                this.active = false;
                
                // Определяем с какой стороны ударили
                const centerX = wall.x + wall.width / 2;
                const centerY = wall.y + wall.height / 2;
                const bulletCenterX = this.x + this.width / 2;
                const bulletCenterY = this.y + this.height / 2;
                
                const dx = bulletCenterX - centerX;
                const dy = bulletCenterY - centerY;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    wall.hit(dx > 0 ? 'right' : 'left');
                } else {
                    wall.hit(dy > 0 ? 'bottom' : 'top');
                }
                return;
            }
        }
        
        // Столкновение с базой
        if (base && rectIntersect(bulletRect, base)) {
            this.active = false;
            gameOver(false);
            return;
        }
        
        // Столкновение с танками
        if (this.fromPlayer) {
            for (let enemy of enemies) {
                if (enemy.alive && rectIntersect(bulletRect, enemy)) {
                    this.active = false;
                    enemy.alive = false;
                    addScore(POINTS_PER_ENEMY);
                    return;
                }
            }
        } else {
            if (player && player.alive && rectIntersect(bulletRect, player)) {
                this.active = false;
                gameOver(false);
            }
        }
    }
    
    draw() {
        const sprite = this.getSprite();
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function rectIntersect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom || 
             r2.bottom < r1.top);
}

function addScore(points) {
    score += points;
    if (score >= WIN_SCORE) {
        gameOver(true);
    }
}

function setupControls() {
    if (controlsInitialized) return;
    controlsInitialized = true;

    // Клавиатура
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        // Предотвращаем скролл стрелками
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

function initGame() {
    walls = [];
    enemies = [];
    bullets = [];
    score = 0;
    gameRunning = true; // 🔥 Важно: ставим true ДО создания объектов
    animationFrame = 0;
    
    // Создаём стены из карты
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const type = MAP[row][col];
            if (type === 1 || type === 2) {
                walls.push(new Wall(
                    col * TILE_SIZE, 
                    row * TILE_SIZE, 
                    type,
                    col,
                    row
                ));
            } else if (type === 3) {
                base = { 
                    left: col * TILE_SIZE, 
                    right: (col + 1) * TILE_SIZE,
                    top: row * TILE_SIZE, 
                    bottom: (row + 1) * TILE_SIZE 
                };
            }
        }
    }
    
    // 🔥 Игрок внизу по центру увеличенной карты
    player = new Tank(9 * TILE_SIZE, 17 * TILE_SIZE, true);
    player.direction = 0;
    player.alive = true;
    
    // 🔥 Создаём врагов в верхней части карты
    enemies = []; // Очищаем массив
    spawnEnemy(0 * TILE_SIZE, 0 * TILE_SIZE);          // Лево
    spawnEnemy(9 * TILE_SIZE, 0 * TILE_SIZE);          // Центр
    spawnEnemy(18 * TILE_SIZE, 0 * TILE_SIZE);         // Право
    
    // Запускаем игровой цикл
    gameLoop();
    
    // Спавн врагов
    setInterval(() => {
        if (gameRunning && enemies.filter(e => e.alive).length < 4) {
            const spawnPoints = [
                {x: 0 * TILE_SIZE, y: 0 * TILE_SIZE},
                {x: 9 * TILE_SIZE, y: 0 * TILE_SIZE},
                {x: 18 * TILE_SIZE, y: 0 * TILE_SIZE}
            ];
            const pos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
            spawnEnemy(pos.x, pos.y);
        }
    }, 5000);
}

function spawnEnemy(x, y) {
    const enemy = new Tank(x, y);
    enemy.direction = 2; // Смотрят вниз
    enemies.push(enemy);
}

function update() {
    if (!gameRunning || !player) return;
    
    // 🔥 УПРАВЛЕНИЕ ИГРОКОМ
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        let moved = player.move(0, -1); 
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.move(0, 1);
    }
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.move(-1, 0);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.move(1, 0);
    }
    if (keys[' ']) {
        player.shoot();
    }
    
    player.update();
    
    // 🔥 Враги обновляются сами в enemy.update()
    enemies.forEach(enemy => {
        if (enemy && enemy.alive) {
            enemy.update();
        }
    });
    
    // 🔥 ОБНОВЛЕНИЕ ПУЛЬ
    bullets = bullets.filter(b => b.active);
    bullets.forEach(b => b.update());
    
    // Анимация
    animationFrame++;
}

function draw() {
    // Очистка
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // База
    if (base) {
        if (assets.flag && assets.flag.complete) {
            ctx.drawImage(assets.flag, base.left, base.top, TILE_SIZE, TILE_SIZE);
        } else {
            ctx.fillStyle = '#4a90d9';
            ctx.fillRect(base.left, base.top, TILE_SIZE, TILE_SIZE);
        }
    }
    
    // Стены
    walls.forEach(w => w.draw());
    
    // Пули
    bullets.forEach(b => b.draw());
    
    // Игрок
    if (player) player.draw();
    
    // Враги
    enemies.forEach(e => e.draw());
    
    // Счёт
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`SCORE: ${score}/${WIN_SCORE}`, 10, canvas.height - 10);
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(() => gameLoop());
    }
}

function gameOver(won) {
    gameRunning = false;

    setTimeout(() => {

        if (won) {
            document.getElementById('game-container').classList.add('hidden');
            showCongratulations();
        } else {
            alert(`GAME OVER\nScore: ${score}`);

            // Очистка перед рестартом
            bullets = [];
            enemies = [];
            walls = [];

            initGame(); // запускаем заново
        }

    }, 500);
}

// 📱 МОБИЛЬНОЕ УПРАВЛЕНИЕ
function setupMobileControls() {
    const buttons = document.querySelectorAll('.dpad-btn, .fire-btn');
    
    buttons.forEach(btn => {
        const key = btn.dataset.key;
        
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys[key] = true;
            btn.classList.add('active');
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys[key] = false;
            btn.classList.remove('active');
        });
        
        btn.addEventListener('mousedown', () => {
            keys[key] = true;
            btn.classList.add('active');
        });
        
        btn.addEventListener('mouseup', () => {
            keys[key] = false;
            btn.classList.remove('active');
        });
        
        btn.addEventListener('mouseleave', () => {
            keys[key] = false;
            btn.classList.remove('active');
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAssets();
    setupControls();
    setupMobileControls();
});