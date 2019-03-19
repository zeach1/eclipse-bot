import { expMultiplier } from '../config/index';

interface RankInterface {
  exp?: number;
  points?: number;
}

export default class Rank {
  // Describes how much the user has interacted with the chat. User starts with 0 exp.
  public exp: number;

  /*
   * Describes how much the user has done certain stuff (not sure yet).
   * User starts with 5000 points.
   */
  public points: number;

  // Level of the user, directly related to exp.
  public get level(): number {
    return Math.floor(expMultiplier * Math.sqrt(this.exp));
  }

  public constructor(details: RankInterface) {
    const { exp, points } = details;

    this.exp = exp || 0;
    this.points = points || 5000;
  }
}
