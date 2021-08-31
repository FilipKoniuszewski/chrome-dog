window.addEventListener("load", function (){
    let intervalId;
    const game = {
        init: function (){
            this.obstacles.addObstacle();
            this.startGame(this.obstacles.obstacleArray[0].elem, this.obstacles.obstacleArray[0].pos, this.player.gameChar, this.player.pos)
            this.initKeyEvents(this.player.gameChar, this.player.pos)
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
                if (obstacle.pos === -100){
                    this.removeObstacle(obstacle)
                }
                if (obstacle.pos === 0 && game.player.pos > 400){
                    game.gameOver();
                }
            },
            addObstacle: function (){
                let obstacleElem = getObstacleHtmlElem();
                let pos = parseInt(getComputedStyle(obstacleElem).left);
                this.obstacleArray.push(new Obstacle(obstacleElem, pos))
            },
            removeObstacle: function (obstacle){
                obstacle.elem.remove();
                this.obstacleArray.shift();
            }
        },

        startGame : function (){
            intervalId = setInterval(function (){
                let gameScore = document.getElementById("game-score");
                gameScore.innerHTML = (+gameScore.innerHTML + 1).toString();

                game.obstacles.obstacleArray.forEach(function (obstacle){
                    game.obstacles.moveObstacle(obstacle);
                })
                if (game.obstacles.obstacleArray[game.obstacles.obstacleArray.length-1].pos === 400){
                    game.obstacles.addObstacle();
                }
                game.addGravity();
            },10);
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
            clearInterval(intervalId);
            document.getElementById("game-result").style.display = "flex";
            document.getElementById("game-result-score").innerText =
                "Your score: " + document.getElementById("game-score").innerText;
        }
    };
    game.init()

    function Obstacle(htmlElem, pos){
        this.elem = htmlElem;
        this.pos = pos;
    }

    function jump(event) {
        if (event.key === " " || event.key === "ArrowUp"){
            if (game.player.pos === 450) {
                game.player.jumping = true;
                game.player.gameChar.classList.remove("player-full");
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
        let obstacleClasses = ["obstacle-low", "obstacle-high", "obstacle-double"]
        obstacle.classList.add(obstacleClasses[Math.floor(Math.random() * 3)])
        // obstacle.classList.add("obstacle-low")
        gameField.appendChild(obstacle);
        return obstacle;
    }
})