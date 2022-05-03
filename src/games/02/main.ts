import p5 from "p5";
import { blockDesign } from "./blockDesign";
import { Vector, Ball, Entity, Block, Racket, BlockType, PowerupItem } from "./Vector";

type GameState = "start" | "playing" | "gameover" | "clear";

export const canvasSize = {
  x: 480,
  y: 560,
};

(async () => {
  new p5((p: p5) => {
    let isDebugMode = false;
    let isStart = true;
    let racket: Racket;
    let lastRacketP: { x: number; y: number };
    let ball: Entity;
    let rank: number;
    let frame: number;
    let gameState: GameState;
    let blocks: Block[] = [];
    let powerupItems: PowerupItem[] = [];
    const FPS = 60;

    const init = () => {
      racket = new Racket( 
        new Vector(canvasSize.x / 2, canvasSize.y * 0.9),
        new Vector(4, 4)
      );
      racket.toSuppin();
      ball = new Ball(
        new Vector(racket.p.x, racket.p.y - Ball.radius * 2 - 1),
        new Vector(0,0),
      );
      rank = 1;
      frame = 0;
      gameState = "start";
      isStart = true;
      blocks = blockDesign.map((b) =>
        new Block(
          new Vector(b.x, b.y),
          new Vector(0,0),
          b.type as BlockType)
      );
      powerupItems = [];
      lastRacketP = { x: racket.p.x, y: racket.p.y };
    };

    const drawPlayer = (racket: Racket) => {
      p.fill("#fcfcfc");
      p.rect(racket.p.x, racket.p.y, racket.size.width, racket.size.height);
    };

    const drawBall = (ball: Ball) => {
      p.fill("#fcfcfc");
      p.ellipse(ball.p.x, ball.p.y, Ball.radius * 2);
    };

    const drawBlock = (b: Block) => {
      switch (b.type) {
        case "normal":
          p.fill("#fcfcfc");
          p.rect(b.p.x, b.p.y, Block.size.width, Block.size.height);
          return;
        case "strong":
          p.fill("#8c8c8c");
          p.rect(b.p.x, b.p.y, Block.size.width, Block.size.height);
          return;
        case "powerup":
          p.fill("#b05f5a");
          p.rect(b.p.x, b.p.y, Block.size.width, Block.size.height);
          return;
        case "unbreakble":
          p.fill("#444545");
          p.rect(b.p.x, b.p.y, Block.size.width, Block.size.height);
          return;
      }
    };

    const drawItem = (item: PowerupItem) => {
      switch (item.item) {
        case "expand":
          p.fill("red");
          p.ellipse(item.p.x, item.p.y, 10);
          return;
      }
    };

    const drawGame = () => {
      p.background("#DFDFDE");
      switch (gameState) {
        case "playing":
          drawPlayer(racket);
          drawBall(ball);
          blocks.forEach(drawBlock);
          powerupItems.forEach(drawItem);
          return;
        case "gameover":
          drawGameOverScreen();
          return;
        case "clear":
          drawGameClearScreen();
          return;
        case "start":
          drawStartScreen();
          return;
      }
    };

    const drawDebug = () => {
      const textSize = 10;
      const postion = { x: 0, y: 0 };
      p.fill("#000000");
      p.textSize(textSize);
      p.textAlign(p.LEFT, p.TOP);
      p.text(
`rank:${rank}
fps:${p.frameRate().toFixed(1)}
ball:x:${ball.p.x.toFixed(1)}y:${ball.p.y.toFixed(1)}
ball_vector:x:${ball.v.x.toFixed(3)}y:${ball.v.y.toFixed(3)}
plyaer:x:${racket.p.x.toFixed(1)}y:${racket.p.y.toFixed(1)}
lastPlyaer:x:${lastRacketP.x.toFixed(1)}y:${lastRacketP.y.toFixed(1)}
game state: ${gameState}
version: ${process.env.npm_package_version}
blocks:${blocks.length}
powerUp:${racket.powerUp}
poweupTimer:${racket.powerupTimer}
`,

postion.x, postion.y);
    };

    const drawStartScreen = () => {
      const textSize = 30;
      const postion = { x: 250, y: 150 };
      p.fill("#000000");
      p.textSize(textSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Click to Start`, postion.x, postion.y);
    };

    const drawGameOverScreen = () => {
      const textSize = 30;
      const postion = { x: 250, y: 150 };
      p.fill("#000000");
      p.textSize(textSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Game Over`, postion.x, postion.y);
    };

    const drawGameClearScreen = () => {
      const textSize = 30;
      const postion = { x: 250, y: 150 };
      p.fill("#000000");
      p.textSize(textSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Game Clear!!`, postion.x, postion.y);
    };

    const updateBall = (ball: Ball) => {
      // ボールのx位置が画面端のとき方向を反対に
      if (
        ball.p.x >= canvasSize.x - Ball.radius * 2 ||
        ball.p.x <= Ball.radius * 2
      ) {
        ball.v.x = -ball.v.x;
      }
      // ボールのy位置が画面上部のとき方向を反対に
      if (ball.p.y < Ball.radius) {
        ball.v.y = -ball.v.y;
      }

      let xIsHit = false;
      let yIsHit = false;

      if (
        ball.p.x + Ball.radius >= racket.p.x - racket.halfSize.width &&
        ball.p.x - Ball.radius <= racket.p.x + racket.halfSize.width
      ) {
        xIsHit = true;
      }
      if (
        ball.p.y + Ball.radius >= racket.p.y - racket.halfSize.height &&
        ball.p.y - Ball.radius <= racket.p.y + racket.halfSize.height
      ) {
        yIsHit = true;
      }

      if (xIsHit && yIsHit) {
        // ヒット時
        const w = ball.p.sub(racket.p);
        const r = ball.v.refrect(w);
        ball.v = r;
        ball.v.y = -p.abs(ball.v.y)
        // めり込み防止
      }

      ball.p = ball.p.add(ball.v);
    };

    const updateBlock = (b: Block, i:number, bs:Block[]) => {
      let xIsHit = false;
      let yIsHit = false;

      if (
        ball.p.x + Ball.radius >= b.p.x - Block.halfSize.width &&
        ball.p.x - Ball.radius <= b.p.x + Block.halfSize.width
      ) {
        xIsHit = true;
      } else {
        return b;
      }
      if (
        ball.p.y + Ball.radius >= b.p.y - Block.halfSize.height &&
        ball.p.y - Ball.radius <= b.p.y + Block.halfSize.height
      ) {
        yIsHit = true;
      } else {
        return b;
      }

      if (xIsHit && yIsHit) {
        /**
         *   ┌──────────────────┐
         *   |                  |
         *   |        *         |
         *   |                  |
         *   └──────────────────┘
         */
        const w = ball.p.sub(b.p);
        const r = ball.v.refrect(w);
        ball.v = r;

        b.vitality--;

        if (b.vitality === 0) {
          b.brake();
          bs.splice(i, 1);
          if (b.type === "powerup") {
            powerupItems.push(new PowerupItem(b.p, new Vector(0, 2), "expand"));
          }
        }
      }

      return b;
    };

    const updateGameState = () => {
      if (!blocks.filter(b=>b.type !== "unbreakble").length) {
        gameState = "clear";
      } else if (ball.p.y >= canvasSize.y - Ball.radius) {
        gameState = "gameover";
      }
    };

    const updatePowerUpItem = (i: PowerupItem, index: number, items: PowerupItem[]) => {
      i.p = i.p.add(i.v);
      let [xIsHit, yIsHit] = [false, false];
      if (
        i.p.x + 30 >= racket.p.x - racket.halfSize.width &&
        i.p.x - 30 <= racket.p.x + racket.halfSize.width
      ) {
        xIsHit = true;
      }
      if (
        i.p.y + 30 >= racket.p.y - racket.halfSize.height &&
        i.p.y - 30 <= racket.p.y + racket.halfSize.height
      ) {
        yIsHit = true;
      }
      if (xIsHit && yIsHit) {
        racket.getPowerup(i.item);
        items.splice(index, 1);
      }
      if (i.p.y >= canvasSize.y) {
        items.splice(index, 1);
      }
    };

    const updateRacket = (racket: Racket) => {
      if (racket.powerUp !== "suppin") {
        racket.powerupTimer--;
        if (racket.powerupTimer <= 0) {
          racket.toSuppin();
        }
      }
    };

    const updateGame = () => {
      if (gameState === "playing") {
        updateBall(ball);
        frame++;
        blocks.forEach(updateBlock);
        powerupItems.forEach(updatePowerUpItem);
        updateRacket(racket);
        updateGameState();
        if (frame % 15 === 0) {
          lastRacketP = { x: racket.p.x, y: racket.p.y };
        }
      }
    };

    const onMousePress = (e) => {
      switch (gameState) {
        case "start":
          init();
          gameState = "playing";
          return;
        case "gameover":
          gameState = "start";
          return;
        case "clear":
          gameState = "start";
          return;
        case "playing":
          if (isStart) {
            ball.v.x = 5;
            ball.v.y = -5;
            isStart = false;
          }
          return;
      }
    };

    const onMouseMove = (e) => {
      if (p.mouseX > canvasSize.x - racket.halfSize.width) {
        racket.p.x = canvasSize.x - racket.halfSize.width;
      } else if (p.mouseX < racket.halfSize.width) {
        racket.p.x = racket.halfSize.width;
      } else {
        racket.p.x = p.mouseX;
      }
      if (isStart) {
        if (p.mouseX > canvasSize.x - racket.halfSize.width) {
          ball.p.x = canvasSize.x - racket.halfSize.width;
        } else if (p.mouseX < racket.halfSize.width) {
          ball.p.x = racket.halfSize.width;
        } else {
          ball.p.x = p.mouseX;
        }
      }
    };

    const onKeyPressed = (e) => {
      if (e.key === "1") {
        isDebugMode = !isDebugMode;
      }
    };

    p.setup = () => {
      p.frameRate(FPS);
      p.createCanvas(canvasSize.x, canvasSize.y);
      p.rectMode(p.CENTER);
      p.ellipseMode(p.CENTER);
      init();
    };

    p.draw = () => {
      drawGame();
      updateGame();
      if (isDebugMode) {
        drawDebug();
      }
    };

    p.mousePressed = (e) => {
      onMousePress(e);
    };

    p.mouseMoved = (e) => {
      onMouseMove(e);
    };

    p.keyPressed = (e) => {
      onKeyPressed(e);
    };

    p.touchMoved = (e) => {
      onMouseMove(e);
    };

  });
})();
