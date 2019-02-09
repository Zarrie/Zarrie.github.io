var canvas;
var canvasContext;

// ------- BALL Features -------

var ballXcoordinate;
var ballYcoordinate;

var BALL_RADIUS;

var ballSpeedX;
var ballSpeedY;

var ballTrails = new Array();
var BALL_TRAIT_LEN;

// ------- PADDLES Features -------

var paddle1X;
var paddle1Y;

var paddle2X;
var paddle2Y;

var PADDLE_HEIGHT;
var PADDLE_WIDTH;

var PADDLES_COLOR = "#3090f0";

// ------- Score -------

var player1Score = 0;
var player2Score = 0;

var FONT_SIZE;

// ------- Computer movements -------

var AUTOMOVE_STEP;

// ------- NET features -------

var GAP_LEN;
var NET_WIDTH;
var NET_COLOR = "#48c0ff";

var BACKGROUND_COLOR = "#303030";

var FONT_COLOR = "#d86060";
var FONT_SIZE_STYLE = "2em 'Lucida Grande'";


function drawNet(){
	for(var i = 0 ; i < canvas.height ; i += GAP_LEN){
		canvasContext.fillStyle = NET_COLOR;
		canvasContext.fillRect(canvas.width / 2 - NET_WIDTH / 2, i + GAP_LEN / 2, NET_WIDTH, GAP_LEN / 2);
	}
}

function drawBall(){
	ballTrails.push({x:ballXcoordinate,
					 y:ballYcoordinate});

	if(ballTrails.length > BALL_TRAIT_LEN)
		ballTrails.shift();

	for(var i = 0 ; i < ballTrails.length ; i++){
		let alpha = i / ballTrails.length;
		canvasContext.fillStyle = "rgba(240, 96, 96," + alpha.toString() + ")"; // ball color
		canvasContext.beginPath();
		canvasContext.arc(ballTrails[i].x, ballTrails[i].y, BALL_RADIUS, 0, 2 * Math.PI, true);
		canvasContext.fill();		
	}
}

function updateBallPosition(){
	if(ballXcoordinate <= paddle1X + 2 * PADDLE_WIDTH){
		if(ballYcoordinate >= paddle1Y && ballYcoordinate <= paddle1Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;
			let dy = ballYcoordinate - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedY = dy / 3;
		}
		else{
			resetBall();
			player2Score += 1;
		}
	}
	if(ballXcoordinate >= paddle2X - PADDLE_WIDTH){
		if(ballYcoordinate >= paddle2Y && ballYcoordinate <= paddle2Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;
			let dy = ballYcoordinate - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedY = dy / 3;
		}
		else{
			resetBall();
			player1Score += 1;
		}
	}
	if(ballYcoordinate < 0){
		ballSpeedY = -ballSpeedY;
	}
	if(ballYcoordinate > canvas.height){
		ballSpeedY = -ballSpeedY;
	}

	ballXcoordinate += ballSpeedX;
	ballYcoordinate += ballSpeedY;
}

function resetBall(){
	ballSpeedX = -ballSpeedX;
	ballSpeedY = -ballSpeedY * (0.5 + Math.random());
	ballXcoordinate = canvas.width / 2;
	ballYcoordinate = canvas.height / 2;
}

function drawPaddles(){
	canvasContext.fillStyle = PADDLES_COLOR;
	canvasContext.fillRect(paddle1X, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);

	canvasContext.fillStyle = PADDLES_COLOR;
	canvasContext.fillRect(paddle2X, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

}

function automove(){
	var paddle2Center = paddle2Y + (PADDLE_HEIGHT / 2);
	if(paddle2Center < ballYcoordinate - (PADDLE_HEIGHT / 3)){
		paddle2Y += AUTOMOVE_STEP;
	}
	else if(paddle2Center > ballYcoordinate + (PADDLE_HEIGHT / 3)){
		paddle2Y -= AUTOMOVE_STEP;
	}
}

function drawCanvasBackground(){
	canvasContext.fillStyle = BACKGROUND_COLOR;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore(){
	canvasContext.restore();
	canvasContext.font = FONT_SIZE_STYLE;
	canvasContext.setLineDash([canvas.height / 200]);

	// canvasContext.textAlign = "start";
	// canvasContext.strokeStyle = FONT_COLOR;
	// canvasContext.strokeText(player1Score.toString(), canvas.width / 4, canvas.height / 8);

	// canvasContext.textAlign = "end";
	// canvasContext.strokeStyle = FONT_COLOR;
	// canvasContext.strokeText(player2Score.toString(), 3 * canvas.width / 4, canvas.height / 8);

	canvasContext.textAlign = "start";
	canvasContext.fillStyle = FONT_COLOR;
	canvasContext.fillText(player1Score.toString(), canvas.width / 4, canvas.height / 8);

	canvasContext.textAlign = "end";
	canvasContext.fillStyle = FONT_COLOR;
	canvasContext.fillText(player2Score.toString(), 3 * canvas.width / 4, canvas.height / 8);
}

function getMousePosition(event){
	var rect = canvas.getBoundingClientRect();
	var mouseX = event.clientX - rect.left;
	var mouseY = event.clientY - rect.top;

	mouseX /= rect.width;
	mouseY /= rect.height;

	mouseX *= canvas.width;
	mouseY *= canvas.height;

	return {
		x:mouseX,
		y:mouseY
	};
}

function draw(){
	automove();
	drawCanvasBackground();	
	drawPaddles();
	updateBallPosition();
	drawBall();
	drawNet();
	drawScore();
}

function init(){
	console.log(canvas.width);
	console.log(canvas.height);

	canvas.width *= 3;
	canvas.height *= 3;

	BALL_RADIUS = canvas.width * 0.004;

	ballSpeedX = canvas.width * 0.01;
	ballSpeedY = canvas.height * 0.01;

	BALL_TRAIT_LEN = canvas.width / 69;

	AUTOMOVE_STEP = canvas.height * 0.01;

	NET_WIDTH = canvas.width * 0.005;
	GAP_LEN = 40;

	ballXcoordinate = canvas.width / 2;
	ballYcoordinate = canvas.height / 2;

	PADDLE_WIDTH = Math.ceil(canvas.width * 0.01);
	PADDLE_HEIGHT = Math.ceil(canvas.height * 0.12);

	paddle1X = PADDLE_WIDTH;
	paddle1Y = canvas.height / 2 - PADDLE_HEIGHT;

	paddle2X = canvas.width - 2 * PADDLE_WIDTH;
	paddle2Y = paddle1Y;

	canvas.addEventListener("mousemove", function(event){
		var mousePosition = getMousePosition(event);
			paddle1Y = mousePosition.y - (PADDLE_HEIGHT / 2);
	});
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");

	init();

	let FPS = 30;
	setInterval(function(){
		draw();
	}, 1000 / FPS)
};