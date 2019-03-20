import { expMultiplier } from '../config/index';

interface RankOptions {
  exp?: number;
  points?: number;
}

export default class Rank {
  /*
   * Describes how much the user has interacted with the chat. User starts with 0 exp.
   * Range of exp is [0, inf].
   */
  private exp: number = 0;

  /*
   * Describes how much the user has done certain stuff (not sure yet).
   * User starts with 5000 points. Range of points is (1, 9999].
   */
  private points: number = 5000;

  public constructor(options?: RankOptions) {
    if (!options) return;

    const { exp, points } = options;

    if (exp) this.setExp(exp);
    if (points) this.setPoints(points);
  }

  public getExp(): number { return this.exp; }

  public getPoints(): number { return this.points; }

  /**
   * Level is directly related to exp.
   */
  public getLevel(): number {
    return Math.floor(expMultiplier * Math.sqrt(this.exp));
  }

  public setExp(exp: number): void {
    this.exp = exp < 0 ? 0 : exp;
  }

  public setPoints(points: number): void {
    if (points <= 0) {
      this.points = 1;
    } else if (points > 9999) {
      this.points = 9999;
    } else {
      this.points = points;
    }
  }
}
