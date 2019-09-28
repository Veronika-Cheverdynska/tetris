const cvs = document.querySelector("#tetris");
const ctx = cvs.getContext("2d");
const scoreShow = document.querySelector("#score-value");
const scoreShowGameOver = document.querySelector("#score-game-over");
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 30;
const VACANT = "white"; //color of en empty square


const gameOverBlock = document.querySelector("#game-over");

//Restart
function restartFunction() {
   location.reload();
}

//draw a square
function drawSquare(x,y,color){
   ctx.fillStyle = color;
   ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
 
   ctx.strokeStyle = "#b5b5b5";
   ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
 }

 let board = [];
for(r=0; r<ROW; r++){
  board[r] = [];
  for(c=0; c<COL; c++){
    board[r][c] = VACANT;
  }
}

//draw the board
function drawBoard(){
   for(r=0; r<ROW; r++){
     for(c=0; c<COL; c++){
       drawSquare(c,r,board[r][c]);
     }
   }
 }
 
 drawBoard();

 //the pieces and colors
 const PIECES = [
   [Z, "red"],
   [T, "green"],
   [I, "blue"],
   [O, "orange"],
   [J, "purple"],
   [L, "pink"],
   [S, "yellow"],
 ];

 //generate random pieces
function randomPiece(){
   let r = randomN = Math.floor(Math.random() * PIECES.length); //0 -> 6
   return new Piece(PIECES[r][0],PIECES[r][1]);
 }

 let p = randomPiece();

//the object piece
function Piece(tetromino,color){
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; //start from the first pattern
  this.activeTetromino = this.tetromino[this.tetrominoN];

  //control of the pieces
  this.x = 5;
  this.y = -2;
}

//fill function
Piece.prototype.fill = function(color){
   for(r=0; r<this.activeTetromino.length; r++){
     for(c=0; c<this.activeTetromino.length; c++){
       //we draw only occupied squares
       if(this.activeTetromino[r][c]){
         drawSquare(this.x + c,this.y + r,color);
       }
     }
   }
 }
 
 //draw a piece to the board
 Piece.prototype.draw = function(){
   this.fill(this.color);
 }
 
 //undraw a piece
 Piece.prototype.unDraw = function(){
   this.fill(VACANT);
 }
 
 //move down the piece
 Piece.prototype.moveDown = function(){
   if(!this.collision(0,1,this.activeTetromino)){
     this.unDraw();
     this.y++;
     this.draw();
   }else{
     //we lock the piece and generate a new one
     this.lock();
     p = randomPiece();
   }
 }
 
 //move right function
 Piece.prototype.moveRight = function(){
   if(!this.collision(1,0,this.activeTetromino)){
     this.unDraw();
     this.x++;
     this.draw();
   }
 }
 
 //move left function
 Piece.prototype.moveLeft = function(){
   if(!this.collision(-1,0,this.activeTetromino)){
     this.unDraw();
     this.x--;
     this.draw();
   }
 }
 
 //rotate function
 Piece.prototype.rotate = function(){
   let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
   let kick = 0;
   if(this.x > COL/2){
     //it's the right wall
     kick = -1; //move the piece to the left
   }else{
     //it's the left wall
     kick = 1; //move the piece to the right
   }
 
   if(!this.collision(kick,0,nextPattern)){
     this.unDraw();
     this.x += kick;
     this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; //(0+1)%4 => 1
     this.activeTetromino = this.tetromino[this.tetrominoN];
     this.draw();
   }
 }
 
 let score = 0;
 
 Piece.prototype.lock = function(){
   for(r=0; r<this.activeTetromino.length; r++){
     for(c=0; c<this.activeTetromino.length; c++){
       //we skip the vacant squares
       if(!this.activeTetromino[r][c]){
         continue;
       }
       //pieces to lock on top = game over
       if(this.y + r < 0){
         //alert("Game Over. Your score " + score + "!");
         scoreShowGameOver.innerHTML = score;
         gameOverBlock.style.display = "block";
         //stop the request animation frame
         gameOver = true;
         break;
       }
       //we lock the piece
       board[this.y+r][this.x+c] = this.color;
     }
   }
   //remove full row
   for(r=0; r<ROW; r++){
     let isRowFull = true;
     for(c=0; c<COL; c++){
       isRowFull = isRowFull && (board[r][c] != VACANT);
     }
     if(isRowFull){
       //if the row is full
       //move down all the rows abowe it
       for(y=r; y>1; y--){
         for(c=0; c<COL; c++){
           board[y][c] = board[y-1][c];
         }
       }
       //the top row board[0][...] has no row above it
       for(c=0; c<COL; c++){
         board[0][c] = VACANT;
       }
       //increment the score
       score += 10;
     }
   }
   //update the board
   drawBoard();
 
   //update the score
   scoreShow.innerHTML = score;
 }
 
 //collision function
 Piece.prototype.collision = function(x,y,piece){
   for(r=0; r<piece.length; r++){
     for(c=0; c<piece.length; c++){
       //check the square is empty, we skip it
       if(!piece[r][c]){
         continue;
       }
       //coordinates of the piece after movement
       let newX = this.x + c + x;
       let newY = this.y + r + y;
 
       //conditions
       if(newX < 0 || newX >= COL || newY >= ROW){
         return true;
       }
       //sip newY < 0; board[-1] will crash the game
       if(newY < 0){
         continue;
       }
       //check if there is a locked piece alredy in place
       if(board[newY][newX] != VACANT){
         return true;
       }
     }
   }
   return false;
 }


 //control the piece
 function rotateFunction() {
    p.rotate();
 }
 function leftFunction() {
   p.moveLeft();
 }
 function rightFunction() {
   p.moveRight();
 }
 function downFunction() {
   p.moveDown();
 }
 
 document.addEventListener("keydown",CONTROL);
 function CONTROL(event){
   if(event.keyCode == 37){
      leftFunction()
   }else if(event.keyCode == 38){
      rotateFunction()
   }else if(event.keyCode == 39){
      rightFunction()
   }else if(event.keyCode == 40){
      downFunction()
   }
 }
 
 //drop the piece every 1sec
 let dropStart = Date.now();
 let gameOver = false;
 let time = 1000;
 
 function drop(){
   let now = Date.now();
   let delta = now - dropStart;
   if(delta > time){
     p.moveDown();
     if(time > 100){
       time = time - 2;
     }
     dropStart = Date.now();
   }
   if(!gameOver){
     requestAnimationFrame(drop);
   }
 }
 
 drop();

