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
            pos: 450
        },
        obstacles : {
            obstacleArray: [],
            moveObstacle: function (obstacle){
                obstacle.pos -= 5;
                obstacle.elem.style.left = obstacle.pos + "px";
                if (obstacle.pos === -100){
                    this.removeObstacle(obstacle)
                    this.addObstacle();
                }
                if (obstacle.pos === 0 && game.player.pos > 390){
                    game.gameOver();
                }
            },
            addObstacle: function (){
                this.obstacleArray.push(new Obstacle(getObstacleHtmlElem(), 930))
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
                if(game.obstacles.obstacleArray.length>0){
                    game.obstacles.moveObstacle(game.obstacles.obstacleArray[0]);
                }
                game.addGravity();
            },10);
        },
        addGravity : function (){
            if (game.player.pos < 450){
                game.player.pos += 3;
                game.player.gameChar.style.top = game.player.pos + "px";
            }
            if (game.player.pos === 450){
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
                game.player.gameChar.classList.remove("player-full");
                game.player.gameChar.classList.add("player-jumping");
                game.player.pos -= 150;
                game.player.gameChar.style.top = game.player.pos + "px";
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
        gameField.appendChild(obstacle);
        return obstacle;
    }
})