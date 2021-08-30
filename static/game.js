window.addEventListener("load", function (){
    const game = {
        init: function (){
            this.startGame(this.enemy.enemy, this.enemy.posEnemy, this.gameChar.gameChar, this.gameChar.posY)
            this.initKeyEvents(this.gameChar.gameChar, this.gameChar.posY)
        },
        gameChar : {
            gameChar: document.getElementById("game-character"),
            posY: 450
        },
        enemy : {
            enemy: document.getElementById("game-enemy"),
            posEnemy: 980
        },
        startGame : function (){
            setInterval(function (){
                let gameScore = document.getElementById("game-score");
                gameScore.innerHTML = (+gameScore.innerHTML + 1).toString();
                game.moveEnemy();
                game.addGravity();
            },10)
        },
        moveEnemy: function (){
            game.enemy.posEnemy -= 1;
            game.enemy.enemy.style.left = game.enemy.posEnemy + "px";
            if (game.enemy.posEnemy === 0){
                game.enemy.enemy.remove();
            }
        },
        addGravity : function (){
            if (game.gameChar.posY < 450){
                game.gameChar.posY += 1;
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

    function jump(event) {
        if (event.key === " " || event.key === "ArrowUp"){
            if (game.gameChar.posY === 450) {
                game.gameChar.posY -= 100;
                game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
            }
        }
    }
    function duck(event){
        if (event.key === "ArrowDown" && game.gameChar.posY === 450){
            game.gameChar.posY += 25;
            game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
        }
    }
    function unDuck(event){
        if (event.key === "ArrowDown" && game.gameChar.posY === 475){
            game.gameChar.posY = 450;
            game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
        }
    }
})