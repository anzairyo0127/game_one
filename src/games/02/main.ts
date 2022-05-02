import p5 from "p5";
import { blockDesign } from "./blockDesign";
import { Vector, Ball, Entity, Block, Racket, BlockType } from "./Vector";

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
    const FPS = 60;

    const init = () => {
      racket = new Racket( 
        new Vector(canvasSize.x / 2, canvasSize.y * 0.9),
        new Vector(4, 4)
      );
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
      lastRacketP = { x: racket.p.x, y: racket.p.y };
    };

    const drawPlayer = (racket: Racket) => {
      p.fill("#F7F5F2");
      p.rect(racket.p.x, racket.p.y, Racket.size.width, Racket.size.height);
    };

    const drawBall = (ball: Ball) => {
      p.fill("#F7F5F2");
      p.ellipse(ball.p.x, ball.p.y, Ball.radius * 2);
    };

    const drawBlock = (b: Block) => {
      p.fill("#8D8DAA");
      p.rect(b.p.x, b.p.y, Block.size.width, Block.size.height);
    };

    const drawGame = () => {
      p.background("#DFDFDE");
      switch (gameState) {
        case "playing":
          drawPlayer(racket);
          drawBall(ball);
          blocks.forEach(drawBlock);
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
      const textSize = 8;
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
blocks:${blocks.length}`,

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
        ball.p.x > canvasSize.x - Ball.radius ||
        ball.p.x < Ball.radius
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
        ball.p.x + Ball.radius >= racket.p.x - Racket.halfSize.width &&
        ball.p.x - Ball.radius <= racket.p.x + Racket.halfSize.width
      ) {
        xIsHit = true;
      }
      if (
        ball.p.y + Ball.radius >= racket.p.y - Racket.halfSize.height &&
        ball.p.y - Ball.radius <= racket.p.y + Racket.halfSize.height
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

        b.brake();
        bs.splice(i, 1);
      }

      return b;
    };

    const updateGameState = () => {
      if (!blocks.length) {
        gameState = "clear";
      } else if (ball.p.y >= canvasSize.y - Ball.radius) {
        gameState = "gameover";
      }
    };

    const updateGame = () => {
      if (gameState === "playing") {
        updateBall(ball);
        frame++;
        blocks.forEach(updateBlock);
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
      if (p.mouseX > canvasSize.x - Racket.halfSize.width) {
        racket.p.x = canvasSize.x - Racket.halfSize.width;
      } else if (p.mouseX < Racket.halfSize.width) {
        racket.p.x = Racket.halfSize.width;
      } else {
        racket.p.x = p.mouseX;
      }
      if (isStart) {
        if (p.mouseX > canvasSize.x - Racket.halfSize.width) {
          ball.p.x = canvasSize.x - Racket.halfSize.width;
        } else if (p.mouseX < Racket.halfSize.width) {
          ball.p.x = Racket.halfSize.width;
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
      p.frameRate(60);
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
