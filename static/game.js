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
                game.enemy.posEnemy -= 1;
                game.enemy.enemy.style.left = game.enemy.posEnemy + "px";
                if (game.enemy.posEnemy === 0){
                    game.enemy.enemy.remove();
                }
                if (game.gameChar.posY < 450){
                    game.gameChar.posY += 5;
                    game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
                }
            },10)
        },
        initKeyEvents : function (){
            window.addEventListener("keydown", function (event) {
                if (event.key === " " || event.key === "ArrowUp") {
                    if (game.gameChar.posY > 0) {
                        game.gameChar.posY -= 50;
                        game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
                    }
                }else if (event.key === "ArrowDown"){
                    if (game.gameChar.posY < 450) {
                        game.gameChar.posY += 25;
                        game.gameChar.gameChar.style.top = game.gameChar.posY + "px";
                    }
                }
            })
        }
    };
    game.init()
})