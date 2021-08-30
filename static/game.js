window.addEventListener("load", function (){
    const game = {
        init: function (){
            const gameChar = document.getElementById("game-character");
            let posX = 0;
            let posY = 450;
            let enemy = document.getElementById("game-enemy");
            let posEnemy = 980;

            this.startGame(enemy, posEnemy)
            this.initKeyEvents(gameChar, posX, posY)
        },
        startGame : function (enemy, posEnemy){
            setInterval(function (){
                posEnemy -= 10;
                enemy.style.left = posEnemy + "px";
                if (posEnemy === 0){
                    enemy.remove();
                }
            },1000)
        },
        initKeyEvents : function (gameChar, posX, posY){
            window.addEventListener("keydown", function (event) {
                if (event.key === "ArrowRight"){
                    if (posX < 950) {
                        posX += 25;
                        gameChar.style.left = posX + "px";
                    }
                }else if (event.key === "ArrowLeft"){
                    if (posX > 0) {
                        posX -= 25;
                        gameChar.style.left = posX + "px";
                    }
                }else if (event.key === "ArrowUp") {
                    if (posY > 0) {
                        posY -= 25;
                        gameChar.style.top = posY + "px";
                    }
                }else if (event.key === "ArrowDown"){
                    if (posY < 450) {
                        posY += 25;
                        gameChar.style.top = posY + "px";
                    }
                }
            })
        }
    };
    game.init()
})