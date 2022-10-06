/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var bosque, invisibleBosque;

var Naruto_running;
var Naruto_collided;
var gameOverImg;
var restartImg;
var shrub1;
var shrub2;
var shrub3;
var bosqueImg;
var enemigo1Imagen;
var ambuImg;

var enemigosGroup, enemigosGroup2, enemigo1, enemigo2;
var naruto;

var Yen=0;

var gameOver, restart;

var enemigo2;

function preload(){
  Naruto_running =   loadAnimation("assets/Naruto1.png","assets/Naruto2.png","assets/Naruto3.png");
  Naruto_collided = loadAnimation("assets/Naruto1.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png")
  shrub1 = loadImage("assets/equipo1.png");
  shrub2 = loadImage("assets/equipo2.png");
  shrub3 = loadImage("assets/equipo3.png");
  bosqueImg = loadImage("assets/bosqueNaruto.jpg");  
  enemigo1Imagen= loadImage("assets/itachi.png");
  ambuImg = loadAnimation("assets/ambu1.png", "assets/ambu2.png", "assets/ambu3.png","assets/ambu4.png","assets/ambu5.png","assets/ambu6.png");
}

function setup() {
  createCanvas(800, 400);

  bosque = createSprite(400,100,400,20);
  bosque.addImage("bosque",bosqueImg);
  bosque.scale=1.4
  bosque.x = width /2;

  naruto = createSprite(0,300,20,50);
  naruto.addAnimation("running", Naruto_running);
  naruto.addAnimation("collided", Naruto_collided);
  naruto.scale = 1;
  naruto.setCollider("circle",0,0,50)
    
  invisibleGround = createSprite(400,370,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,250);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.15;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  enemigosGroup = new Group();
  enemigosGroup2 = new Group();
  
  yen = 0;

}

function draw() {
  background(255);
  
  naruto.x=camera.position.x-270;
   
  if (gameState===PLAY){

    bosque.velocityX=-3

    if(bosque.x<100)
    {
       bosque.x=400
    }

    if(keyDown("space")&& naruto.y>270) {
      
      naruto.velocityY = -12;
    }
  
    naruto.velocityY = naruto.velocityY + 0.8
    spawnShrubs();
    spawnenemigo1();
    spawnenemigo2();

    naruto.collide(invisibleGround);
    
    if(enemigosGroup.isTouching(naruto)){

      gameState = END;
      //naruto.velocityY = -12;
    }
    if(enemigosGroup2.isTouching(naruto)){

      gameState = END;
      //naruto.velocityY = -12;
    }
    if(shrubsGroup.isTouching(naruto)){
      yen = yen + 30;
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    naruto.velocityY = 0;
    bosque.velocityX = 0;
    enemigosGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    enemigosGroup2.setVelocityXEach(0);

    naruto.changeAnimation("collided",Naruto_collided);
    
    enemigosGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    enemigosGroup2.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("space")) {
        reset();
    }
  }

  else if (gameState === WIN) {
    bosque.velocityX = 0;
    naruto.velocityY = 0;
    enemigosGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    enemigosGroup2.setVelocityXEach(0);

    naruto.changeAnimation("collided",Naruto_collided);

    enemigosGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    enemigosGroup2.setLifetimeEach(-1);

  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("yen: "+ yen, camera.position.x,50);
  
  if(yen >= 300){
    naruto.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("¡Felicidades! ¡Ganaste el juego! ", 70,200);
    gameState = WIN;
  }

  
  naruto.debug = true;


}

function spawnShrubs() {
 
  if (frameCount % 80 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*yen/50)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
       
    shrub.scale = 0.45;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnenemigo1() {
  if(frameCount % 185 === 0) {

    var enemigo = createSprite(camera.position.x+400,330,40,40);
    enemigo.setCollider("rectangle",0,0,200,200)
    enemigo.addImage(enemigo1Imagen);
    enemigo.velocityX = -(6 + 3*yen/50)
    enemigo.scale = 0.3;      

    enemigo.lifetime = 400;
    enemigosGroup.add(enemigo);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  naruto.visible = true;
  naruto.changeAnimation("running",Naruto_running);
  enemigo2.changeAnimation("running",ambuImg);
  enemigosGroup.destroyEach();
  shrubsGroup.destroyEach();
  enemigosGroup2.destroyEach();
  yen = 0;
}

function spawnenemigo2() {
  if(frameCount % 135 === 0) {

    var enemigo2 = createSprite(camera.position.x+400,330,40,40);
    enemigo2.setCollider("rectangle",0,0,40,40)
    enemigo2.addAnimation("ambu", ambuImg);
    enemigo2.velocityX = -(6 + 3*yen/50)
    enemigo2.scale = 1.5;      

    enemigo2.lifetime = 400;
    enemigosGroup2.add(enemigo2);
    enemigo2.debug = true;
  }
}