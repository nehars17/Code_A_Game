/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/Apple.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake

let d;


function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        d = "LEFT";
        left.play();
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();

    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();

    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();

    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){

    ctx.drawImage(ground,0,0);

    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg, food.x, food.y);

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();

        //Generate new food
        var foodInSnake = true
        while (foodInSnake) {
          var new_x = Math.floor(Math.random()*17+1) * box
          var new_y = Math.floor(Math.random()*15+3) * box
          var newFood = {
            x:new_x,
            y:new_y
          }
          //Check if food was generated in the snake
          for (var i = 0; i < snake.length; i++) {
            if (collision(newFood, snake)){
              console.log("Food generated at wrong place")
            }
            else {
              food = newFood
              foodInSnake = false
            }
          }
        }
        // food = {
        //     x : Math.floor(Math.random()*17+1) * box,
        //     y : Math.floor(Math.random()*15+3) * box
        // }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }

    // add new Head

    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over


    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
        $('#exampleModal').modal('show')
        document.getElementById('score').innerHTML = score;
        if(score > highest_score["Score"]|| highest_score["Score"]==null){
          highest_score["User"] = user["User"]
          highest_score["Score"] = score
          localStorage.setItem("Highest_Score", JSON.stringify(highest_score));
        }

    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Comic Sans MS";
    ctx.fillText(score,2*box,1.6*box);
}

var user = JSON.parse(sessionStorage.getItem('Current User'));
var highest_score=localStorage.getItem('Highest_Score');

if(highest_score==null){
  highest_score={
    "User":null,
    "Score":null
  };
}
else{
  highest_score = JSON.parse(highest_score);
}

document.getElementById('currentUser').innerText = user["User"];
document.getElementById('highest_scorer').innerText = highest_score["User"];
document.getElementById('highest_score').innerText = highest_score["Score"];



var Interval;
var game

// call draw function every 100 ms
// call draw function different timing for speed
function gameMode(mode){
  switch (mode) {
    // Easy
    case 0:
      Interval = 250;
      document.getElementById('GameModeText').innerText = "Easy";
      break;
    // Medium
    case 1:
      Interval = 150;
      document.getElementById('GameModeText').innerText = "Medium";
      break;
    // Hard
    case 2:
      Interval = 100;
      document.getElementById('GameModeText').innerText = "Hard";
      break;
  }
  console.log("Gamemode changed")
}

function playGame(){
  document.getElementById('easy-btn').disabled = true;
  document.getElementById('medium-btn').disabled = true;
  document.getElementById('hard-btn').disabled = true;
  if(Interval==null){
    Interval = 250;
  }
  game = setInterval(draw, Interval);
  document.addEventListener("keydown",direction);
}



//let game = setInterval(draw,150);
//let game = setInterval(draw,100);
