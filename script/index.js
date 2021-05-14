var bird = document.createElement('div');
var container = document.getElementById('container');
var start = document.getElementById('start');

if ( !localStorage.getItem('highscore')){
    localStorage.setItem("highscore", 0);
}

start.addEventListener('click', function(){
    var startScreen = document.getElementById('start-screen');
    startScreen.style.display = 'none';
    container.style.display = 'block';
    startGame();
});

var dropBird;
function drop(){
    dropBird = setInterval( function(){
        var marginTop = parseInt(bird.style.getPropertyValue('margin-top'));
        var newTop = (marginTop+10) * 1.05;
        if (marginTop < -10){
            newTop = -10;
        }
        bird.style.marginTop = newTop + 'px';
    }, 100);

}

var touchBottom;
function checkTouchBottom(){
    touchBottom = setInterval(function(){
        var marginTop = parseInt(bird.style.getPropertyValue('margin-top'));
        if(marginTop > 440){
            clearInterval(touchBottom);
            collisionDetected();
        }
    },10);
}



checkTouchBottom();
drop();


function CreateObstacle(top){
    this.top = top;
    this.moveLeft = 5;

    var topPipe = document.createElement('div');
    topPipe.style.width = '100px';
    topPipe.style.height = '500px';
    topPipe.innerHTML = '<img style="width: 100px; height: 500px;" src="./images/downpipe.png" alt="downpipe" />'

    var downPipe = document.createElement('div');
    downPipe.style.width = '100px';
    downPipe.style.height = '500px';
    downPipe.style.marginTop = '200px';
    downPipe.innerHTML = '<img style="width: 100px; height: 500px;" src="./images/toppipe.png" alt="toppipe" />'

    this.element = document.createElement('div');
    this.element.style.marginTop = top + 'px';
    this.element.style.marginLeft = '1000px';
    this.element.style.position = 'absolute';
    this.element.style.zIndex = '0';
    this.element.appendChild(topPipe);
    this.element.appendChild(downPipe);
}

var obstacles;
var obstacleElements = [];
function startGame(){

    bird.style.width = '50px';
    bird.style.height = '50px';
    bird.style.marginLeft = '100px';
    bird.style.marginTop = '100px';
    bird.style.position = 'absolute';
    bird.style.zIndex = '1';
    bird.innerHTML = '<img style="width: 50px; height: 50px;" src="./images/bird.png" alt="bird_image" />'
    container.appendChild(bird);

    var obstacle;
    obstacles = setInterval( function(){
        var top = parseInt( Math.random() * 200 - 450 );
        obstacle = new CreateObstacle(top);
        container.appendChild(obstacle.element, top);
        moveObstacle(obstacle);
        obstacleElements.push(obstacle)
    }, 3000);
}


var score = 0;
function moveObstacle(obstacle){
    var left;
    var obstacleMoving = setInterval(function(){
        left = parseInt(obstacle.element.style.getPropertyValue('margin-left'));
        left -= obstacle.moveLeft;
        obstacle.element.style.marginLeft = left + 'px';
        var birdTop = parseInt(bird.style.getPropertyValue('margin-top'));
        var top = parseInt(obstacle.element.style.getPropertyValue('margin-top'));
        var space = top + 500;

        if ( ( ( left >= 0 && left <= 150 )  && !( birdTop > space && birdTop < (space + 150) )) ){
            clearInterval(obstacleMoving);
            collisionDetected();
        }
        if ( left === 0 ){
            score++;
            updateScore(score);
        }
    }, 50);
}

var scoreDisplay;
function showScore(){
    scoreDisplay = document.createElement('div');
    scoreDisplay.style.width = '50px';
    scoreDisplay.style.padding = '10px 0';
    scoreDisplay.style.color = 'white';
    scoreDisplay.style.fontSize = '50px';
    scoreDisplay.style.marginTop = '25px';
    scoreDisplay.style.marginLeft = '375px';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.textAlign = 'center';
    scoreDisplay.style.zIndex = '1';
    scoreDisplay.innerHTML = score;
    container.appendChild(scoreDisplay);
}

function updateScore(score){
    scoreDisplay.innerHTML = score;
}

function showHighscore(){
    var highScore = document.getElementById('highscore');
    highScore.innerHTML = "Highscore: " + localStorage.getItem('highscore');
}

function collisionDetected(){
    clearInterval(dropBird);
    clearInterval(obstacles);

    bird.style.marginTop = '440px';
    
    var gameOver = document.getElementById('gameOver');
    gameOver.style.display = 'block';
    var showScore = document.getElementById('showScore');
    showScore.innerHTML = "Your Score: "+ score;

    var high = localStorage.getItem('highscore');
    if(score > high){
        localStorage.setItem('highscore', score);
        high = score;
        showScore.innerHTML = "New High Score: "+ high;
    }
    score = 0;

    for (var i = 0; i < obstacleElements.length; i++ ){
        obstacleElements[i].moveLeft = 0;
    }
}

var restart = document.getElementById('restart');
restart.addEventListener('click', function(){
    startGame();
    var gameOver = document.getElementById('gameOver');
    gameOver.style.display = 'none';
    drop();
    for (var i = 0 ; i < obstacleElements.length; i++){
        obstacleElements[i].element.style.display = 'none';
    }
    scoreDisplay.innerHTML = '0';
    checkTouchBottom();
})

showHighscore();
showScore();

window.addEventListener('keypress', function(e){
    if( e.key === ' ' ){
        var marginTop = parseInt(bird.style.getPropertyValue('margin-top'));
        if(marginTop >= 440){
            return;
        }
        marginTop -=  100;
        bird.style.marginTop = marginTop + 'px';
    } 
});