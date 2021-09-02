window.addEventListener("load", function (){
    const game = {
        gameStarted : false,
        initStart: function () {
            this.disableRightClick();
            this.initJump();
        },
        initStartingAnimation : function (){
            animatedCharacter();
            let pos = 0;
            let startingAnimationInterval = setInterval(function (){
                pos++;
                game.player.gameChar.style.left = pos + "px";
                if (pos === 20){
                    clearInterval(startingAnimationInterval);
                    clearInterval(game.characterIntervalAnimation);
                    game.initGame();
                }
            },25);

        },
        initGame: function () {
            this.initDuck();
            document.getElementById("game-container").removeAttribute("style");
            document.getElementById("game-background").removeAttribute("style");
            game.player.gameChar.removeAttribute("style");
            this.obstacles.addObstacle();
            this.startGame();
            this.counter.counterInit();
            this.music.startMusic();
        },
        music : {
            elem : document.getElementById("music"),
            startMusic : function (){
                this.elem.play();
                this.elem.volume = 0.08;
            },
            stopMusic : function (){
                this.elem.pause();
            }
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
        timeOut : 10,
        gameIntervalId : 0,
        characterIntervalAnimation : 0,
        obstacleIntervalId : 0,
        nightMode : true,
        counter : {
            counterVal : 0,
            counterInterval : 0,
            counterInit : function(){
                this.counterInterval = setInterval(function (){
                    console.log(game.counter.counterVal);
                    game.counter.counterVal++;
                    if (game.counter.counterVal >0 && game.counter.counterVal%10 === 0){
                        clearInterval(game.gameIntervalId);
                        clearInterval(game.characterIntervalAnimation);
                        game.counter.counterVal = 0;
                        game.timeOut -= 1;
                        game.randomPos.posArray.push(400);
                        game.startGame();
                    }
                },1000)
            }
        },
        obstacles : {
            obstacleArray: [],
            moveObstacle: function (obstacle){
                obstacle.pos -= 2;
                obstacle.elem.style.left = obstacle.pos + "px";
                let obstacleWidth = parseInt(getComputedStyle(obstacle.elem).width);
                if (obstacle.pos <= (-100 - obstacleWidth)){
                    for (let i=1; i< this.obstacleArray.length;i++){
                        this.obstacleArray[i].pos = this.obstacleArray[i].pos + obstacleWidth;
                        this.obstacleArray[i].elem.style.left = this.obstacleArray[i].pos + "px";
                    }
                    this.removeObstacle(obstacle)
                    game.gameScore.score += 1;
                    if (game.gameScore.score%5 === 0) {
                        if (game.nightMode === true) {
                            document.getElementById("game-background").classList.remove("game-background-1")
                            document.getElementById("game-background").classList.add("game-background-2")
                            document.getElementById("game-container").classList.remove("game-container-background1");
                            document.getElementById("game-container").classList.add("game-container-background2");
                            document.getElementById("game-score").style.color = "white";
                            document.getElementById("game-result").classList.remove("game-result-day")
                            document.getElementById("game-result").classList.add("game-result-night")
                            game.nightMode = false;
                        }
                        else {
                            document.getElementById("game-background").classList.remove("game-background-2")
                            document.getElementById("game-background").classList.add("game-background-1")
                            document.getElementById("game-container").classList.remove("game-container-background2");
                            document.getElementById("game-container").classList.add("game-container-background1");
                            document.getElementById("game-score").style.color = "black";
                            document.getElementById("game-result").classList.remove("game-result-night")
                            document.getElementById("game-result").classList.add("game-result-day")
                            game.nightMode = true;
                        }
                    }
                    if (game.gameScore.score%5 === 0) {
                        hitPointsSound()
                    }
                }
                if (isCollision(obstacle)){
                    game.isGameOver = true;
                    game.gameOver();
                }
            },
            addObstacle: function (){
                let obstacleElem = getObstacleHtmlElem();
                let widthSum = 0;
                for (let obstacle of game.obstacles.obstacleArray){
                    widthSum += parseInt(getComputedStyle(obstacle.elem).width);
                }
                let pos = 900 - widthSum;
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
                game.addObstacles();
            },game.timeOut*0.7);
            animatedCharacter();
        },
        randomPos : {
            alreadyChosen : false,
            posArray : [100, 100, 100,100 , 100, 200, 200, 200, 200, 300, 300, 400],
            pos : 0,
            getRandomPos : function (){
                if (!this.alreadyChosen){
                    this.pos = this.posArray[Math.floor(Math.random() * this.posArray.length)];
                    this.alreadyChosen = true;
                }
            }
        },
        addObstacles : function (){
            game.randomPos.getRandomPos();
            if (game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].pos < game.randomPos.pos &&
                !game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].addedNextObstacle){
                    game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].addedNextObstacle = true;
                    game.obstacles.addObstacle();
                    game.randomPos.alreadyChosen = false;
            }
        },
        disableRightClick : function (){
            window.addEventListener("contextmenu",function (event){
                event.preventDefault();
            })
        },
        initJump : function (){
            window.addEventListener("keydown", jump)
        },
        initDuck : function (){
            window.addEventListener("keydown", duck)
            window.addEventListener("keyup", unDuck)
        },
        isGameOver : false,
        gameOver: function (){
            loseSound()
            game.music.stopMusic();
            game.player.gameChar.removeAttribute("class");
            game.player.gameChar.classList.add("player", "player-full", "player-game-over");
            window.removeEventListener("keydown", jump)
            window.removeEventListener("keydown", duck)
            window.removeEventListener("keyup", unDuck)
            result();
            document.getElementById("game-score").remove();
            clearInterval(game.gameIntervalId);
            document.getElementById("game-container").style.animationPlayState = 'paused';
            document.getElementById("game-background").style.animationPlayState = 'paused';
            clearInterval(game.characterIntervalAnimation);
            clearInterval(game.counter.counterInterval);
        }
    };

    function result() {
        document.getElementById("game-result").style.display = "flex";
        document.getElementById("game-result-score").innerText =
            document.getElementById("game-score").innerText
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
        },game.timeOut*15);
    }
    function Obstacle(htmlElem, pos){
        this.elem = htmlElem;
        this.pos = pos;
        this.addedNextObstacle = false;
    }

    function jump(event) {
        if (event.key === " " || event.key === "ArrowUp"){
            if (game.player.pos === 450) {
                if(!game.gameStarted){
                    game.player.gameChar.classList.remove("player-standing");
                }
                jumpSound()
                game.player.jumping = true;
                game.player.gameChar.classList.remove("player-full");
                game.player.gameChar.classList.remove("player-animation")
                game.player.gameChar.classList.remove("player-animation1")
                game.player.gameChar.classList.add("player-jumping");
                let jumpId = setInterval(function (){
                    if(game.isGameOver){
                        clearInterval(jumpId);
                        game.player.gameChar.removeAttribute("style");
                    } else {
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
                                if (!game.gameStarted){
                                    game.gameStarted = true;
                                    game.initStartingAnimation();
                                }
                            }
                        }
                    }
                },game.timeOut*2.5);
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
        let obstacleClasses = ["obstacle-low", "obstacle-low", "obstacle-high",
            "obstacle-double", "obstacle-double", "obstacle-flying", "obstacle-flying"]
        obstacle.classList.add(obstacleClasses[Math.floor(Math.random() * obstacleClasses.length)])
        return obstacle;
    }
    function isCollision(obstacle){
        let playerTop = parseInt(getComputedStyle(game.player.gameChar).top);
        let obstacleHeight = parseInt(getComputedStyle(obstacle.elem).height);
        return (
            (obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <= 0 && obstacle.pos >= -80
                && playerTop !== 460)
            ||
            (!obstacle.elem.classList.contains("obstacle-flying") && obstacle.pos <=0 && obstacle.pos >= -80
            && game.player.pos > (420-obstacleHeight))
        )
    }
    function loseSound() {
        let audio = new Audio("static/sounds/losing_sound.mp3");
        audio.play();
    }
    function jumpSound() {
        let audio = new Audio("static/sounds/jump_one.mp3");
        audio.play();
    }
    function hitPointsSound() {
        let audio = new Audio("static/sounds/point.mp3");
        audio.play();
    }
    game.initStart();
})