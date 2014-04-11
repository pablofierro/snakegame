/**
 * Snake Game
 * @author Pablo Fierro
 */
var snakeGame = {

    width: 0,
    height: 0,
    animationId: null,
    timeOutId: null,
    canvas: document.getElementById("game"),
    scoreEl: document.getElementById("score").children[0],
    started: false,
    foodPoint: null,
    blockWidth: 10,
    foodMultiplier: 5,
    snakeColor: "#00ABBF",
    score: 0,

    // direction variables
    moving: '',
    framesPerSecond: 28,

    prep: function() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = this.canvas.getContext("2d");
        this.loop = this.loop.bind(this);
        this.snake = snake;
    },

    loadGame: function() {
        this.prep();
        this.snake.init();
        this.drawGame();
    },

    startGame: function() {

        this.started = true;
        this.animationId = requestAnimationFrame(this.loop);

    },

    // draws game board
    drawGame: function() {

        if(this.foodPoint === null) {
            this.foodPoint = this.generateRandomBlock();
        }

        this.context.clearRect(0, 0, this.width, this.height);

        // draws food
        this.context.fillStyle = 'white';
        this.context.fillRect(this.foodPoint.x, this.foodPoint.y, snakeGame.blockWidth, snakeGame.blockWidth);

        // draws snake
        for(var i = 0; i < this.snake.blocks.length; i++) {
            var block = this.snake.blocks[i];
            this.context.fillStyle = this.snakeColor;
            this.context.fillRect(block.x, block.y, snakeGame.blockWidth, snakeGame.blockWidth);
        }

        if(this.snake.checkBodyCollition()) {
            this.resetGame();
            return false;
        }

        // check food collision
        if(this.snake.checkPointCollision(this.foodPoint)) {
            this.score += 10;
            this.scoreEl.innerText = this.score;
            this.snake.insertNewBlock(this.foodMultiplier);
            this.foodPoint = this.generateRandomBlock();
        }

        this.snake.moveBlocks(this.moving);

    },

    // main animation loop
    loop: function() {

        var exit = false;
            headBlock = this.snake.blocks[0];

        // checks boundaries
        if((headBlock.x < this.width && headBlock.x >= 0 && headBlock.y >= 0 && headBlock.y < this.height)) {
            if(this.drawGame() === false) {
                exit = true;
            }
        }
        else {
            // cancelAnimationFrame(this.animationId);
            this.resetGame();
            exit = true;
        }

        if(!exit) {

            this.timeOutId = setTimeout(function() {
                requestAnimationFrame(this.loop);
            }.bind(this), 1000 / this.framesPerSecond);

        }

    },

    // resets match
    resetGame: function() {
        console.log('You suck pal...');
        cancelAnimationFrame(this.animationId);
        clearTimeout(this.timeOutId);
        this.timeOutId = null;
        this.animationId = null;
        this.snake.reset();
        this.score = 0;
        this.scoreEl.innerText = this.score;
        this.started = false;
        this.moving = '';
        this.foodPoint = this.generateRandomBlock();
        this.drawGame();
    },

    // Generates random point based on the block and canvas width
    generateRandomBlock: function() {
        var x = Math.floor(Math.floor(Math.random()*this.width) / this.blockWidth) * this.blockWidth;
        var y = Math.floor(Math.floor(Math.random()*this.height) / this.blockWidth) * this.blockWidth;
        // checks that generated block does not collide with the snake body
        for(var i = 0; i < snake.blocks.length; i++) {
            if(snake.blocks[i].x === x && snake.blocks[i].y === y) {
                return snakeGame.generateRandomBlock();
            }
        }
        return { x: x, y: y };
    },

    // on keystrokes
    onKeyStrokes: function(e) {

        var key = e.keyCode;

        if(this.moving !== 'left' && key === 39) {
            this.changeDirection('right');
        }
        else if(this.moving !== 'right' && key === 37) {
            this.changeDirection('left');
        }
        else if(this.moving !== 'down' && key === 38) {
            this.changeDirection('up');
        }
        else if(this.moving !== 'up' && key === 40) {
            this.changeDirection('down');
        }

        // waits for user input to start game
        if(!this.started && (key >= 37 && key <= 40)) {
            this.startGame();
        }

    },

    changeDirection: function(dir) {
        setTimeout(function() {
            snakeGame.moving = dir;
        }, 20);
    }


};

/**
 * Snake Class
 */
var snake = {

    blocks: Array(),

    init: function() {
        this.blocks.push({ x: 0, y: 0 });
    },

    // move all blocks into one direction
    moveBlocks: function(direction) {

        var dx, dy;

        if(direction === 'right') {
            dx = snakeGame.blockWidth;
            dy = 0;
        }
        else if(direction === 'left') {
            dx = -snakeGame.blockWidth;
            dy = 0;
        }
        else if(direction === 'up') {
            dy = -snakeGame.blockWidth;
            dx = 0;
        }
        else if(direction === 'down') {
            dy = snakeGame.blockWidth;
            dx = 0;
        }

        dx = dx || 0;
        dy = dy || 0;

        var nextX = 0;
        var nextY = 0;

        for(var i = 0; i < this.blocks.length; i++) {

            var block = this.blocks[i];

            if(i === 0) {

                nextX = block.x;
                nextY = block.y;

                block.x += dx;
                block.y += dy;

            }
            else {

                var tmpX = block.x;
                var tmpY = block.y;

                block.x = nextX;
                block.y = nextY;

                nextX = tmpX;
                nextY = tmpY;

            }

        }

    },

    reset: function() {

        this.blocks = Array();
        this.init();

    },

    // check point collision
    checkPointCollision: function(point) {

        var block = this.blocks[0];

        if(block.x == point.x && block.y == point.y) {
            return true;
        }

        return false;

    },

    // check if head will crash
    checkBodyCollition: function() {

        if(this.blocks.length <= 2) {
            return false;
        }

        for(var i = 1; i <= this.blocks.length-1; i++) {

            if(this.checkPointCollision(this.blocks[i])) {
                return true;
            }

        }

        return false;

    },

    // insert new block at head
    insertNewBlock: function(multiplier) {

        for(var i = 0; i < multiplier; i++) {
            var last = this.blocks[this.blocks.length-1];
            this.blocks.push({ x: last.x, y: last.y });
        }

    }

}

// let it roll...
snakeGame.loadGame();

/**
 * Keyboard Event Listener
 * 37: left
 * 39: right
 * 38: up
 * 40: down
 */
window.addEventListener('keydown', snakeGame.onKeyStrokes.bind(snakeGame));