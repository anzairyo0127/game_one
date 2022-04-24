import p5 from "p5";

import * as I from "./interface";

/* エンティティ */
let player: I.Entity;
let blocks: I.Entity[];
let gameState: I.GameState;
let score: number;
let highScore: number;


const updatePosition = (entity: I.Entity) => {
  entity.x += entity.vx;
  entity.y += entity.vy;
};

const createPlayer = () => {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0,
  };
};

const createBlock = (y: number) => {
  return {
    x: 900,
    y,
    vx: -2,
    vy: 0,
  };
};

const applyGravity = (entity: I.Entity) => {
  entity.vy += 0.15;
};

const applyJump = (entity: I.Entity) => {
  entity.vy = -5;
};

const playerIsAlive  = (player: I.Entity) => {
  return player.y < 600;
}

new p5((p: p5) => {
  function entitiesAreColliding(
    entityA,
    entityB,
    collisionXDistance,
    collisionYDistance
  ) {
    // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す
  
    const currentXDistance = p.abs(entityA.x - entityB.x); // 現在のx距離
    if (collisionXDistance <= currentXDistance) return false;
  
    const currentYDistance = p.abs(entityA.y - entityB.y); // 現在のy距離
    if (collisionYDistance <= currentYDistance) return false;
  
    return true; // ここまで来たら、x方向でもy方向でも重なっているので true
  }
  

  const drawGameoverScreen = () => {
    p.background(0, 192)
    p.fill(255);
    p.textSize(64);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("GAME OVER", p.width / 2, p.height / 2);
  };

  const resetGame = () => {
    gameState = "play";
    player = createPlayer();
    blocks = [];
    score = 0;
  };

  const updateGame = () => {
    if (gameState === "gameover") return;

    score++;

    if (p.frameCount % 120 === 1) addBlockPair(blocks);
    blocks = blocks.filter(blockIsAlive);

    updatePosition(player);
    blocks.forEach(updatePosition);
    applyGravity(player);

    if (!playerIsAlive(player)) gameState = "gameover";

    blocks.forEach(block => {
      if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
        gameState = "gameover";
        return;
      }
    })
  };

  const drawGame = () => {
    p.background("#160040");
    drawPlayer(player);
    drawScore(score);
    blocks.forEach(drawBlock);
    
    if (gameState === "gameover") drawGameoverScreen();
  };

  const onMousePress = () => {
    switch(gameState) {
      case "play":
        applyJump(player);
        return;
      case "gameover":
        resetGame();
        return;
    }
  };

  const drawPlayer = (entity: I.Entity) => {
    p.noStroke();
    p.fill("#9A0680");
    p.square(entity.x, entity.y, 40);
  };

  const drawScore = (score:number) => {
    p.fill(255);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${score}`, 780, 20);
  };

  const drawBlock = (entity: I.Entity) => {
    p.noStroke();
    p.fill("#4C0070");
    p.rect(entity.x, entity.y, 80, 400);
  };

  const addBlockPair = (blocks: I.Entity[]) => {
    const y = p.random(-100, 100);
    blocks.push(createBlock(y));
    blocks.push(createBlock(y + 600));
  };

  const blockIsAlive = (block: I.Entity): boolean => {
    return block.x > -100;
  };

  p.setup = () => {
    p.frameRate(60);
    p.createCanvas(800, 600);
    p.rectMode(p.CENTER);

    resetGame();
  };

  p.draw = () => {
    updateGame();
    drawGame();
  };

  p.mousePressed = (e) => {
    onMousePress();
  };
});
