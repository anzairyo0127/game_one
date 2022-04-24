export interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type GameState = "gameover" | "play";
