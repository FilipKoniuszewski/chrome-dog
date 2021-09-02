window.addEventListener("load", function (){
    const game = {
        init: function (){
            this.obstacles.addObstacle();
            this.addObstacles();
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
                this.elem.innerHTML = this.score.toString();
            }
        },
        timeOut : 10,
        gameIntervalId : 0,
        characterIntervalAnimation : 0,
        obstacleIntervalId : 0,
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
                // obstacle.pos -= 5;
                obstacle.pos -= 2;
                obstacle.elem.style.left = obstacle.pos + "px";
                let obstacleWidth = parseInt(getComputedStyle(obstacle.elem).width);
                if (obstacle.pos <= (-100 - obstacleWidth) && this.obstacleArray.length > 1){
                    this.obstacleArray[1].pos = this.obstacleArray[1].pos + obstacleWidth;
                    this.obstacleArray[1].elem.style.left = this.obstacleArray[1].pos + "px";
                    this.removeObstacle(obstacle)
                    game.gameScore.score += 1;
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
            game.gameIntervalId = setInterval(function (){
                game.gameScore.keepScore();
                game.obstacles.obstacleArray.forEach(function (obstacle){
                    game.obstacles.moveObstacle(obstacle);
                })
                // if (game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].pos === 100){ //dodawanie kolejnych przeszkod
                //     game.obstacles.addObstacle();
                // }
            },game.timeOut*0.7);
            animatedCharacter();
        },
        addObstacles : function (){
            let counter = 0;
            game.obstacleIntervalId = setInterval(function (){
                counter++;
                console.log(counter);
                if (counter%50 === 0) {
                    game.obstacles.addObstacle();
                }
            },100)
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
            clearInterval(game.gameIntervalId);
            document.getElementById("game-container").style.animationPlayState = 'paused';
            document.getElementById("game-background").style.animationPlayState = 'paused';
            clearInterval(game.characterIntervalAnimation);
            clearInterval(game.counter.counterInterval);
            result();
        }
    };

    function result() {
        document.getElementById("game-result").style.display = "flex";
        document.getElementById("game-result-score").innerText =
            "Your score: " + document.getElementById("game-score").innerText
    }
    function animatedCharacter() {
        game.characterIntervalAnimation = setInterval(function () {
            if (game.player.gameChar.classList.contains("player-full")){
                if (game.player.gameChar.classList.contains('player-animation1')) {
                    game.player.gameChar.className += ' player-animation'
                    game.player.gameChar.classList.remove("player-animation1")
                }
                else {
                    game.player.gameChar.className += ' player-animation1';
                    game.player.gameChar.classList.remove("player-animation")
                }
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
                    if (game.player.pos < 275) {
                        game.player.jumping = false;
                    }
                    if (game.player.jumping){
                        game.player.pos -= 10;
                        game.player.gameChar.style.top = game.player.pos + "px";
                    }
                    else {
                        game.player.pos += 10;
                        game.player.gameChar.style.top = game.player.pos + "px";
                        if (game.player.pos === 450){
                            clearInterval(jumpId)
                            game.player.jumping = false;
                            game.player.gameChar.classList.remove("player-jumping");
                            game.player.gameChar.classList.add("player-full", "player-animation");
                        }
                    }
                },game.timeOut*2);
            }
        }
    }
    function duck(event){
        if (event.key === "ArrowDown" && game.player.pos === 450){
            game.player.gameChar.removeAttribute("style");
            game.player.gameChar.classList.remove("player-full");
            game.player.gameChar.classList.remove("player-animation");
            game.player.gameChar.classList.remove("player-animation1");
            game.player.gameChar.classList.add("player-ducked");
        }
    }
    function unDuck(event){
        if (event.key === "ArrowDown"){
            game.player.gameChar.removeAttribute("style");
            game.player.gameChar.classList.remove("player-ducked");
            game.player.gameChar.classList.add("player-full", "player-animation");
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
    function isCollision(obstacle){
        let playerTop = parseInt(getComputedStyle(game.player.gameChar).top);
        let obstacleHeight = parseInt(getComputedStyle(obstacle.elem).height);
        return (
            (obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <= 10 && obstacle.pos >= -80
                && playerTop !== 460 && (game.player.pos === 450 || game.player.pos >430-obstacleHeight))
            ||
            (!obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <=10 && obstacle.pos >= -80
            && game.player.pos > (430-obstacleHeight))
        )
    }

    game.init()
})