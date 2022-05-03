export class Vector {
  public x: number;
  public y: number;

  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }

  /**
   * 引数otherVectorとのベクトルの和を返す
   * */ 
  add(otherV: Vector) {
    return new Vector(this.x + otherV.x, this.y + otherV.y);
  }

  /** 
   * 引数実数sをかけたVectorを返す
   * */
  mul(s: number) {
    return new Vector(this.x * s, this.y * s);
  }

  /**
   * このベクトルの大きさを返す
   * */ 
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * 引数otherVectorとのベクトルの差を返す
   * */
  sub(otherV: Vector) {
    return new Vector(this.x - otherV.x, this.y - otherV.y);
  }

  /**
   * このベクトルを正規化したものを返す
   * */ 
  norm() {
    return this.mul(1/this.mag());
  }

  /**
   * このベクトルと引数otherVectorとのドット積（内積）を返す
   * */ 
  dot(otherV: Vector) {
    return this.x * otherV.x + this.y * otherV.y;
  }

  /**
   * このベクトルと引数法線ベクトルwとの反射ベクトルを求める
   */
  refrect(w: Vector) {
    const cosTheta = this.mul(-1).dot(w) / (this.mul(-1).mag() * w.mag());
    const n = w.norm().mul(this.mag() * cosTheta);
    const r = this.add(n.mul(2));
    return r;
  }
}

export class Entity {
  public p: Vector; // Postion
  public v: Vector; // Velocity

  constructor(_p: Vector, _v: Vector) {
    [this.p, this.v] = [_p, _v];
  }
}

export class Racket extends Entity {
  public powerupTimer = 0;
  public powerUp: Powerup = "suppin";
  private static __size = {
    width: 70,
    height: 10,
  };
  private static __halfSize = {
    width: Racket.__size.width / 2,
    height: Racket.__size.height / 2,
  };

  public size = Racket.__size;
  public halfSize = Racket.__halfSize;

  public toSuppin = () => {
    this.size =  Racket.__size;
    this.halfSize = Racket.__halfSize;
    this.powerUp = "suppin";
  }

  private toExpand = () => {
    this.size = { width: Racket.__size.width * 2, height: Racket.__size.height };
    this.halfSize = { width: this.size.width / 2, height: Racket.__size.height / 2 };
    this.powerUp = "expand";
  }

  public getPowerup = (powerUp: Powerup) => {
    this.powerupTimer = 30 * 60;
    switch (powerUp) {
      case "expand":
        this.toExpand();
        return;
      case "suppin":
        this.toSuppin();
        return;
    }
  };
}

export class Ball extends Entity {
  /**
   * ボールの半径
   */
  public static radius = 5;
}

export type BlockType = "normal" | "strong" | "powerup" | "unbreakble";

export class Block extends Entity {
  type: BlockType;
  score: number;
  isBroken: boolean;

  public static size = {
    width: 60,
    height: 30,
  };

  public static halfSize = {
    width: Block.size.width / 2,
    height: Block.size.height / 2,
  }

  public vitality = 1;

  constructor(p: Vector, v: Vector, _type: BlockType) {
    super(p, v);
    this.type = _type;
    this.setVitality(this.type);
  }

  public brake = () => {
    this.isBroken = true;
  }

  private setVitality = (type: BlockType) => {
    switch (type) {
      case "normal":
      case "powerup":
        this.vitality = 1;
        return;
      case "strong":
        this.vitality = 5;
        return;
      case "unbreakble":
        this.vitality = 0;
        return;
    }
  }

}

type Powerup = "expand" | "suppin";

export class PowerupItem extends Entity {
  public item : Powerup = null;
  constructor (_p: Vector, _v: Vector, _item:Powerup) {
    super(_p, _v);
    this.item = _item;
  }
}