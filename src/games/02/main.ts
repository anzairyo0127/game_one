import p5 from "p5";
import { blockDesign } from "./blockDesign";

interface Entity {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Block extends Entity {
  type: BlockType;
  score: number;
  isBroken: boolean;
}

type GameState = "start" | "playing" | "gameover" | "clear";

type BlockType = "normal" | "strong" | "powerup";

export const canvasSize = {
  x: 480,
  y: 560,
};

export const playerBarSize = {
  width: 70,
  height: 10,
};

export const ballSize = {
  width: 10,
};

export const blockSize = {
  width: 30,
  height: 10,
};

(async () => {
  new p5((p: p5) => {
    let isDebugMode = false;
    let isStart = true;
    let player: Entity;
    let lastPlayerPosition: { x: number; y: number };
    let ball: Entity;
    let rank: number;
    let frame: number;
    let gameState: GameState;
    let blocks: Block[] = [];

    const createPlayer = (): Entity => {
      return {
        x: canvasSize.x / 2,
        y: canvasSize.y * 0.9,
        dx: 4,
        dy: 4,
      };
    };

    const createBall = (): Entity => ({
      x: player.x,
      y: player.y - ballSize.width,
      dx: 0,
      dy: 0,
    });

    const createBlock = (x: number, y: number, type: BlockType): Block => ({
      x,
      y,
      dx: 0,
      dy: 0,
      type,
      score: 100,
      isBroken: false,
    });

    const init = () => {
      player = createPlayer();
      ball = createBall();
      rank = 1;
      frame = 0;
      gameState = "start";
      isStart = true;
      blocks = blockDesign.map((b) =>
        createBlock(b.x, b.y, b.type as BlockType)
      );
      lastPlayerPosition = { x: player.x, y: player.y };
    };

    const drawPlayer = (entity: Entity) => {
      p.fill("#F7F5F2");
      p.rect(entity.x, entity.y, playerBarSize.width, playerBarSize.height);
    };

    const drawBall = (entity: Entity) => {
      p.fill("#F7F5F2");
      p.ellipse(entity.x, entity.y, ballSize.width);
    };

    const drawBlock = (b: Block) => {
      p.fill("#8D8DAA");
      p.rect(b.x, b.y, blockSize.width, blockSize.height);
    };

    const drawGame = () => {
      p.background("#DFDFDE");
      switch (gameState) {
        case "playing":
          drawPlayer(player);
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
      const textSize = 10;
      const postion = { x: 250, y: 100 };
      p.fill("#000000");
      p.textSize(textSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`rank:${rank}`, postion.x, postion.y);
      p.text(`fps:${p.frameRate()}`, postion.x, postion.y + textSize);
      p.text(
        `ball:x:${ball.x}y:${ball.y}`,
        postion.x,
        postion.y + textSize * 2
      );
      p.text(
        `plyaer:x:${player.x}y:${player.y}`,
        postion.x,
        postion.y + textSize * 3
      );
      p.text(
        `lastPlyaer:x:${lastPlayerPosition.x}y:${lastPlayerPosition.y}`,
        postion.x,
        postion.y + textSize * 4
      );
      p.text(
        `version: ${process.env.npm_package_version}`,
        postion.x,
        postion.y + textSize * 5
      )
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

    const updateBall = (ball: Entity) => {
      // ボールのx位置が画面端のとき方向を反対に
      if (
        ball.x >= canvasSize.x - ballSize.width / 2 ||
        ball.x <= ballSize.width / 2
      ) {
        ball.dx = -ball.dx;
        rank = rank + 0.000001;
      }
      // ボールのy位置が画面端のとき方向を反対に
      if (
        ball.y >= canvasSize.y - ballSize.width / 2 ||
        ball.y <= ballSize.width / 2
      ) {
        ball.dy = -ball.dy;
        rank = rank + 0.000001;
      }

      let xIsHit = false;
      let yIsHit = false;

      if (
        ball.x >= player.x - playerBarSize.width / 2 &&
        ball.x <= player.x + playerBarSize.width / 2
      ) {
        xIsHit = true;
      }
      if (
        ball.y >= player.y - playerBarSize.height / 2 &&
        ball.y <= player.y + playerBarSize.height / 2
      ) {
        yIsHit = true;
      }

      if (xIsHit && yIsHit) {
        const lastX = player.x - lastPlayerPosition.x;
        if (p.abs(lastX) >= 5) {
          if (Math.sign(lastX) >= 0) {
            // 前より右に移動していた場合
            ball.dx = p.abs(ball.dx);
          } else {
            // 前より左に移動していた場合
            ball.dx = -p.abs(ball.dx);
          }
        }
        rank = rank + 0.000001;
        ball.dy = -p.abs(ball.dy);
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      // rankシステムにより速度を上昇させる。
      ball.dx = ball.dx * rank;
      ball.dy = ball.dy * rank;
    };

    const updateRank = () => {
      return 0.0000002;
    };

    const updateBlock = (b: Block) => {
      let xIsHit = false;
      let yIsHit = false;

      if (
        ball.x >= b.x - blockSize.width / 2 &&
        ball.x <= b.x + blockSize.width / 2
      ) {
        xIsHit = true;
      } else {
        return b;
      }
      if (
        ball.y >= b.y - blockSize.height / 2 &&
        ball.y <= b.y + blockSize.height / 2
      ) {
        yIsHit = true;
      } else {
        return b;
      }

      if (xIsHit && yIsHit) {
        if (
          b.x - blockSize.width / 2 <= ball.x &&
          ball.x <= b.x + blockSize.width / 2
        ) {
          // "側面"
          ball.dx = -ball.dx;
        }
        if (
          b.y - blockSize.height / 2 <= ball.y &&
          ball.y <= b.y + blockSize.height / 2
        ) {
          // "上面か底面"
          ball.dy = -ball.dy;
        } else {
          ball.dx = -ball.dx;
          ball.dy = -ball.dy;
        }

        b.isBroken = true;
        rank = rank + 0.00001;
      }

      return b;
    };

    const updateGameState = () => {
      if (!blocks.length) {
        gameState = "clear";
      } else if (ball.y >= canvasSize.y - ballSize.width) {
        gameState = "gameover";
      }
    };

    const updateGame = () => {
      if (gameState === "playing") {
        updateBall(ball);
        frame++;
        rank = rank + updateRank();
        blocks = blocks.map(updateBlock).filter((b) => !b.isBroken);
        updateGameState();
        if (frame % 15 === 0) {
          lastPlayerPosition = { x: player.x, y: player.y };
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
            ball.dx = 3;
            ball.dy = 3;
            isStart = false;
          }
          return;
      }
    };

    const onMouseMove = (e) => {
      if (p.pmouseX > canvasSize.x - playerBarSize.width / 2) {
        player.x = canvasSize.x - playerBarSize.width / 2;
      } else if (p.pmouseX < playerBarSize.width / 2) {
        player.x = playerBarSize.width / 2;
      } else {
        player.x = p.pmouseX;
      }
      if (isStart) {
        if (p.pmouseX > canvasSize.x - playerBarSize.width / 2) {
          ball.x = canvasSize.x - playerBarSize.width / 2;
        } else if (p.pmouseX < playerBarSize.width / 2) {
          ball.x = playerBarSize.width / 2;
        } else {
          ball.x = p.pmouseX;
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
  });
})();
