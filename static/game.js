window.addEventListener("load", function (){
        const game = {
            init: function () {
                const gameChar = document.getElementById("game-character");
                let posX = 0;
                let posY = 450;
                let posEnemy = 980;
                let enemy = document.getElementById("game-enemy")
            },
            addKeysEvents: function (){


        }
    };
    setInterval(function (){
        posEnemy -= 10;
        enemy.style.left = posEnemy + "px";
        if (posX == posEnemy){
            alert("UPS");
        }
        if (posEnemy == 0){
            enemy.remove();
        }
    },10)



    })

})