window.addEventListener("load", function (){
    const game = {
        init: function (){
            this.startGame(this.enemy.enemy, this.enemy.posEnemy, this.gameChar.gameChar, this.gameChar.posY)
            this.initKeyEvents(this.gameChar.gameChar, this.gameChar.posY)
        },
        gameChar : {
            gameChar: document.querySelector(".game-character"),
            posY: 450
        },
        enemy : new Enemy(),

        startGame : function (){
            setInterval(function (){
                let gameScore = document.getElementById("game-score");
                gameScore.innerHTML = (+gameScore.innerHTML + 1).toString();
                game.moveEnemy();
                game.addGravity();
            },10)
        },
        moveEnemy: function (){
            game.enemy.posEnemy -= 5;
            game.enemy.enemy.style.left = game.enemy.posEnemy + "px";
            if (game.enemy.posEnemy === -50){
                game.enemy.enemy.remove()
                game.enemy = new Enemy();

            }
            if (game.enemy.posEnemy === 0 && game.gameChar.posY > 390){
                alert("ups");
            }
        },
        addGravity : function (){
            if (game.gameChar.posY < 450){
                game.gameChar.posY += 2;
                game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
            }
        },
        initKeyEvents : function (){
            window.addEventListener("keydown", jump)
            window.addEventListener("keydown", duck)
            window.addEventListener("keyup", unDuck)
        }
    };
    game.init()
    function Enemy(){
        let gameField = document.getElementById("game-container");
        let enemy = document.createElement("div");
        let enemyClasses = ["enemy-low", "enemy-high", "enemy-double"]
        enemy.classList.add("game-enemy")
        enemy.classList.add(enemyClasses[Math.floor(Math.random() * 3)])
        gameField.appendChild(enemy);
        this.enemy = enemy;
        this.posEnemy = 930;
    }
    function jump(event) {
        if (event.key === " " || event.key === "ArrowUp"){
            if (game.gameChar.posY === 450) {
                game.gameChar.posY -= 400;
                game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
            }
        }
    }
    function duck(event){
        if (event.key === "ArrowDown" && game.gameChar.posY === 450){
            game.gameChar.gameChar.removeAttribute("style");
            game.gameChar.gameChar.classList.remove("game-character-full");
            game.gameChar.gameChar.classList.add("game-character-ducked");
        }
    }
    function unDuck(event){
        if (event.key === "ArrowDown"){
            game.gameChar.gameChar.removeAttribute("style");
            game.gameChar.gameChar.classList.remove("game-character-ducked");
            game.gameChar.gameChar.classList.add("game-character-full");
        }
    }
})