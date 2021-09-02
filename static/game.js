window.addEventListener("load", function (){
    const game = {
        init: function (){
            this.obstacles.addObstacle();
            this.startGame();
            this.initKeyEvents();
            this.counter.counterInit();
        },
        player : {
            gameChar: document.querySelector(".player"),
            pos: 450,
            jumping: false
        },
        gameScore : {
            elem : document.getElementById("game-score"),
            score : 0,
            keepScore : function (){
                this.elem.innerHTML = "Your score: " + this.score.toString();
            }
        },
        timeOut : 20,
        gameIntervalId : 0,
        characterIntervalAnimation : 0,
        counter : {
            counterVal : 0,
            counterInterval : 0,
            counterInit : function(){
                this.counterInterval = setInterval(function (){
                    game.counter.counterVal++;
                    if (game.counter.counterVal >0 && game.counter.counterVal%5 === 0){
                        clearInterval(game.gameIntervalId);
                        clearInterval(game.characterIntervalAnimation);
                        game.timeOut -= 1;
                        // document.getElementById("game-container").style.animation = "animation 2.5s linear infinite";
                        game.startGame();
                    }
                },1000)
            }
        },
        obstacles : {
            obstacleArray: [],
            moveObstacle: function (obstacle){
                obstacle.pos -= 5;
                obstacle.elem.style.left = obstacle.pos + "px";
                let obstacleWidth = parseInt(getComputedStyle(obstacle.elem).width);
                if (obstacle.pos === (-100 - obstacleWidth)){
                    this.obstacleArray[1].pos = this.obstacleArray[1].pos + obstacleWidth;
                    this.obstacleArray[1].elem.style.left = this.obstacleArray[1].pos + "px";
                    this.removeObstacle(obstacle)
                    game.gameScore.score += 1;
                    if (game.gameScore.score === 2) {
                        document.getElementById("game-background").style.background = "url(/static/images/background_night.png) repeat-x 0 / 100% auto";
                    }
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
            animatedCharacter();
            game.gameIntervalId = setInterval(function (){
                console.log(game.timeOut);
                game.addGravity();
                game.gameScore.keepScore();
                game.obstacles.obstacleArray.forEach(function (obstacle){
                    game.obstacles.moveObstacle(obstacle);
                })
                if (game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].pos === 500){ //dodawanie kolejnych przeszkod
                    game.obstacles.addObstacle();
                }
            },game.timeOut);
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
            result();
            document.getElementById("game-score").remove();
            clearInterval(game.gameIntervalId);
            document.getElementById("game-container").style.animationPlayState = 'paused';
            document.getElementById("game-background").style.animationPlayState = 'paused';
            clearInterval(game.characterIntervalAnimation);
        }
    };

    function result() {
        document.getElementById("game-result").style.display = "flex";
        document.getElementById("game-result-score").innerText =
            document.getElementById("game-score").innerText
    }
    function animatedCharacter() {
        game.characterIntervalAnimation = setInterval(function () {
                if (game.player.gameChar.classList.contains('player-animation1')) {
                    game.player.gameChar.className += ' player-animation'
                    game.player.gameChar.classList.remove("player-animation1")
                }
                else {
                    game.player.gameChar.className += ' player-animation1';
                    game.player.gameChar.classList.remove("player-animation")
                }
            },game.timeOut*10);
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
                    jumpingSound()
                    game.player.pos -= 10;
                    game.player.gameChar.style.top = game.player.pos + "px";
                    if (game.player.pos < 275) {
                        clearInterval(jumpId)
                        game.player.jumping = false;
                    }
                },game.timeOut);
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
        // obstacle.classList.add("obstacle-flying");
        return obstacle;
    }
    function isCollision(obstacle) {
        let playerTop = parseInt(getComputedStyle(game.player.gameChar).top)
        if (obstacle.elem.classList.contains("obstacle-flying")
            && obstacle.pos <= 20 && playerTop !== 460
            && (game.player.pos === 450 || game.player.pos >430)) {
                losingSound()
                return true;
        } else if (!obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <=20 && game.player.pos > 400){
            losingSound()
            return true;
        }
        return false;
    }
    function jumpingSound() {
        let audio = new Audio("sounds/jump_two.mp3");
        audio.play();
    }
    function losingSound() {
        let audio = new Audio("sounds/losing_sound.mp3");
        audio.play();
    }
    game.init()
})