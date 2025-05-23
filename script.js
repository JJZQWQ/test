document.addEventListener('DOMContentLoaded', () => {
    // 获取画布和上下文
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 获取按钮和分数元素
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const scoreElement = document.getElementById('scoreValue');
    
    // 游戏常量
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    // 游戏变量
    let snake = []; // 蛇身
    let food = {}; // 食物
    let direction = ''; // 方向
    let nextDirection = ''; // 下一个方向
    let gameInterval; // 游戏循环间隔
    let score = 0; // 分数
    let gameSpeed = 150; // 游戏速度（毫秒）
    let isGameRunning = false; // 游戏是否运行中
    
    // 初始化游戏
    function initGame() {
        // 初始化蛇
        snake = [
            {x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2)}
        ];
        
        // 随机生成食物
        generateFood();
        
        // 设置初始方向
        direction = 'right';
        nextDirection = 'right';
        
        // 重置分数
        score = 0;
        scoreElement.textContent = score;
        
        // 绘制游戏
        drawGame();
    }
    
    // 生成食物
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // 确保食物不在蛇身上
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                generateFood();
                break;
            }
        }
    }
    
    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇
        ctx.fillStyle = '#4CAF50';
        snake.forEach((segment, index) => {
            // 蛇头颜色不同
            if (index === 0) {
                ctx.fillStyle = '#2E7D32';
            } else {
                ctx.fillStyle = '#4CAF50';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // 绘制食物
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    }
    
    // 更新游戏
    function updateGame() {
        // 更新方向
        direction = nextDirection;
        
        // 获取蛇头
        const head = {...snake[0]};
        
        // 根据方向移动蛇头
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // 检查边界碰撞（穿墙）
        if (head.x < 0) head.x = gridWidth - 1;
        if (head.x >= gridWidth) head.x = 0;
        if (head.y < 0) head.y = gridHeight - 1;
        if (head.y >= gridHeight) head.y = 0;
        
        // 检查自身碰撞
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            // 增加分数
            score += 10;
            scoreElement.textContent = score;
            
            // 生成新食物
            generateFood();
            
            // 每增加100分增加游戏速度
            if (score % 100 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                restartGameInterval();
            }
        } else {
            // 如果没吃到食物，移除蛇尾
            snake.pop();
        }
        
        // 添加新蛇头
        snake.unshift(head);
        
        // 绘制游戏
        drawGame();
    }
    
    // 游戏结束
    function gameOver() {
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = '重新开始';
        
        // 绘制"游戏结束"文字
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`最终分数: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // 开始游戏
    function startGame() {
        if (isGameRunning) return;
        initGame();
        isGameRunning = true;
        startBtn.textContent = '重新开始';
        gameInterval = setInterval(updateGame, gameSpeed);
    }
    
    // 暂停游戏
    function stopGame() {
        if (!isGameRunning) return;
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = '继续游戏';
        
        // 绘制"暂停"文字
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
    }
    
    // 重启游戏间隔（更新速度）
    function restartGameInterval() {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }
    
    // 按钮事件监听
    startBtn.addEventListener('click', () => {
        if (isGameRunning) {
            stopGame();
            initGame();
            isGameRunning = true;
            startBtn.textContent = '重新开始';
            gameInterval = setInterval(updateGame, gameSpeed);
        } else {
            startGame();
        }
    });
    
    stopBtn.addEventListener('click', stopGame);
    
    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ': // 空格键
                if (isGameRunning) {
                    stopGame();
                } else {
                    startGame();
                }
                break;
        }
    });
    
    // 初始绘制游戏界面
    initGame();
}); 