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
  public static size = {
    width: 70,
    height: 10,
  };
  public static halfSize = {
    width: Racket.size.width / 2,
    height: Racket.size.height / 2,
  }
}

export class Ball extends Entity {
  public static radius = 5; //半径
}

export type BlockType = "normal" | "strong" | "powerup";

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

  constructor(p: Vector, v: Vector, _type: BlockType) {
    super(p, v);
    this.type = _type;
  }

  public brake = () => {
    this.isBroken = true;
  }

}
