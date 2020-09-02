//selecting canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//creating the "user" paddle
const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

//creating the computer paddle
const computer = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

//creating the ball 
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

//drawing "rectangle = Rect" function
function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h,color);
}

//creating the net
const net ={
    x : canvas.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color: "WHITE"
}

//call net function
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//drawing the Circle aka ball
function drawCircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,false);
    context.closePath();
    context.fill();
}

// drawCircle(100, 100, 50, "WHITE");

//drawing Text
function drawText(text,x,y,color){
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text,x,y);
}
// drawText("hello there",300,200,"WHITE");


function render(){
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    //draw the net
    drawNet();

    //draw score
    drawText(user.score,canvas.width/4,canvas.height/5,"WHITE")
    drawText(computer.score,3*canvas.width/4,canvas.height/5,"WHITE")

    //draw the user and computer paddle
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(computer.x,computer.y,computer.width,computer.height,computer.color);

    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// controling the user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event){
    let rect = canvas.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
}

//collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius; 

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;

}

//reset ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//update : position, movement, score etc.
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //Simple AI to control the computer paddle
    let computerLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    //which player is hitting the ball
    let player = ( ball.x < canvas.width/2) ? user : computer;

    if(collision(ball,player)){
        ball.velocityY = -ball.velocitY;

        //where the ball hits the paddles of the players
        let collidePoint = ball.y - (player.y + player.height/2);

        //normlization
        collidePoint = collidePoint/(player.height/2);
        
        //calculation angle in Radian
        let angleRad = collidePoint * Math.PI/4;

        //X direction of the ball when it's hot 
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        //X direction of the ball when hit 
        //change velocity of X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY=              ball.speed * Math.sin(angleRad);

        //change the ball hit a paddle, we increase its speed
        ball.speed += 0.5; 

    }

        //score keeper
        if(ball.x - ball.radius < 0){
            //computer wins 
            computer.score++;
            resetBall();
        }
        else if (ball.x + ball.radius > canvas.width){
            //If the user wins 
            user.score++;
            resetBall();
        }
    

}

//game initiation 
function game() {
    update();
    render();    
}   

//loop
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);


