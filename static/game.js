window.addEventListener("load", function (){
    let gameIntervalId;
    let characterIntervalAnimation;
    let timeOut = 10;
    const game = {
        init: function (){
            this.obstacles.addObstacle();
            this.startGame();
            this.initKeyEvents();
        },
        player : {
            gameChar: document.querySelector(".player"),
            pos: 450,
            jumping: false
        },
        obstacles : {
            obstacleArray: [],
            moveObstacle: function (obstacle){
                obstacle.pos -= 5;
                obstacle.elem.style.left = obstacle.pos + "px";
                // document.getElementById("game-container").style.animation = "animation 2.66s linear infinite"
                let obstacleWidth = parseInt(getComputedStyle(obstacle.elem).width);
                if (obstacle.pos === (-100 - obstacleWidth)){
                    this.obstacleArray[1].pos = this.obstacleArray[1].pos + obstacleWidth;
                    this.obstacleArray[1].elem.style.left = this.obstacleArray[1].pos + "px";
                    this.removeObstacle(obstacle)
                    let gameScore = document.getElementById("game-score");
                    gameScore.innerHTML = (+gameScore.innerHTML + 1).toString();
                }
                if (isCollision(obstacle)){
                    game.gameOver();
                }
            },
            addObstacle: function (){
                let obstacleElem = getObstacleHtmlElem();
                let widthSum = 0;
                for (let obstacle of game.obstacles.obstacleArray){
                    widthSum += parseInt(getComputedStyle(obstacle.elem).width);
                }
                let pos = 900 - widthSum - parseInt(getComputedStyle(obstacleElem).width);
                obstacleElem.style.left = pos + "px";
                this.obstacleArray.push(new Obstacle(obstacleElem, pos))
            },
            removeObstacle: function (obstacle){
                obstacle.elem.remove();
                this.obstacleArray.shift();
            }
        },
        startGame : function (){
            gameIntervalId = setInterval(function (){
                game.obstacles.obstacleArray.forEach(function (obstacle){
                    game.obstacles.moveObstacle(obstacle);
                })
                if (game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].pos === 100){
                    game.obstacles.addObstacle();
                }
                game.addGravity();
            },timeOut);
            animatedCharacter();
        },
        addGravity : function (){
            if (game.player.pos < 450){
                game.player.pos += 5;
                game.player.gameChar.style.top = game.player.pos + "px";
            }
            if (game.player.pos === 450 && !game.player.jumping){
                game.player.gameChar.classList.remove("player-jumping");
                game.player.gameChar.classList.add("player-full");
            }
        },
        initKeyEvents : function (){
            window.addEventListener("keydown", jump)
            window.addEventListener("keydown", duck)
            window.addEventListener("keyup", unDuck)
        },
        gameOver: function (){
            window.removeEventListener("keydown", jump)
            window.removeEventListener("keydown", duck)
            window.removeEventListener("keyup", unDuck)
            clearInterval(gameIntervalId);
            document.getElementById("game-container").style.animationPlayState = 'paused';
            document.getElementById("game-background").style.animationPlayState = 'paused';
            clearInterval(characterIntervalAnimation);
            document.getElementById("game-result").style.display = "flex";
            document.getElementById("game-result-score").innerText =
                "Your score: " + document.getElementById("game-score").innerText;
        }
    };
    game.init()

    function animatedCharacter() {
        characterIntervalAnimation = setInterval(function () {
                if (game.player.gameChar.classList.contains('player-animation1')) {
                    game.player.gameChar.className += ' player-animation'
                    game.player.gameChar.classList.remove("player-animation1")
                }
                else {
                    game.player.gameChar.className += ' player-animation1';
                    game.player.gameChar.classList.remove("player-animation")
                }
            },timeOut*5);

    }
    function Obstacle(htmlElem, pos){
        this.elem = htmlElem;
        this.pos = pos;
    }

    function jump(event) {
        if (event.key === " " || event.key === "ArrowUp"){
            if (game.player.pos === 450) {
                game.player.jumping = true;
                game.player.gameChar.classList.remove("player-full");
                game.player.gameChar.classList.remove("player-animation")
                game.player.gameChar.classList.remove("player-animation1")
                game.player.gameChar.classList.add("player-jumping");
                let jumpId = setInterval(function (){
                    game.player.pos -= 10;
                    game.player.gameChar.style.top = game.player.pos + "px";
                    if (game.player.pos < 300) {
                        clearInterval(jumpId)
                        game.player.jumping = false;
                    }
                },10);
            }
        }
    }
    function duck(event){
        if (event.key === "ArrowDown" && game.player.pos === 450){
            game.player.gameChar.removeAttribute("style");
            game.player.gameChar.classList.remove("player-full");
            game.player.gameChar.classList.remove("player-animation")
            game.player.gameChar.classList.remove("player-animation1")
            game.player.gameChar.classList.add("player-ducked");
        }
    }
    function unDuck(event){
        if (event.key === "ArrowDown"){
            game.player.gameChar.removeAttribute("style");
            game.player.gameChar.classList.remove("player-ducked");
            game.player.gameChar.classList.add("player-full");
        }
    }
    function getObstacleHtmlElem(){
        let gameField = document.getElementById("game-container");
        let obstacle = document.createElement("div");
        gameField.appendChild(obstacle);
        let obstacleClasses = ["obstacle-low", "obstacle-high", "obstacle-double", "obstacle-flying"]
        obstacle.classList.add(obstacleClasses[Math.floor(Math.random() * 4)])
        return obstacle;
    }
    function isCollision(obstacle){
        let playerTop = parseInt(getComputedStyle(game.player.gameChar).top)
        if (obstacle.elem.classList.contains("obstacle-flying")
            && obstacle.pos <= 0 && playerTop !== 460
            && (game.player.pos === 450 || game.player.pos >430)) {
                return true;
        } else if (!obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <=0 && game.player.pos > 400){
            return true;
        }
        return false;
    }
})