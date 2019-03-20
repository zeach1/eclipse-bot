/* eslint-disable no-unused-expressions */

// Some chai statements will get a linting error so we disable no-unused-expressions.

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { expMultiplier } from '../../src/config/index';

import Rank from '../../src/struct/rank';

function verifyLevel(rank: Rank): boolean {
  return Math.floor(expMultiplier * Math.sqrt(rank.getExp())) === rank.getLevel();
}

describe('Rank class', () => {
  let rank = new Rank();

  it('should initialize with no arguments', () => {
    expect(rank).to.have.property('exp');
    expect(rank).to.have.property('points');
  });

  it('should have proper default values in proper fields', () => {
    expect(rank.getExp()).to.equal(0);
    expect(rank.getPoints()).to.equal(5000);
    expect(verifyLevel(rank)).to.be.true;
  });

  it('should initialize properly with given exp and points', () => {
    rank = new Rank({
      exp: 1000,
      points: 6000,
    });

    expect(rank.getExp()).to.equal(1000);
    expect(rank.getPoints()).to.equal(6000);
    expect(verifyLevel(rank)).to.be.true;
  });

  it('should initialize properly with given exp', () => {
    rank = new Rank({
      exp: 1000,
    });

    expect(rank.getExp()).to.equal(1000);
    expect(rank.getPoints()).to.equal(5000);
    expect(verifyLevel(rank)).to.be.true;
  });

  it('should initialize properly with given points', () => {
    rank = new Rank({
      points: 6000,
    });

    expect(rank.getExp()).to.equal(0);
    expect(rank.getPoints()).to.equal(6000);
    expect(verifyLevel(rank)).to.be.true;
  });

  it('should maintain boundaries for fields', () => {
    rank.setExp(-1);
    expect(rank.getExp()).to.equal(0);
    expect(verifyLevel(rank)).to.be.true;

    rank.setPoints(10000);
    expect(rank.getPoints()).to.equal(9999);

    rank.setPoints(-1);
    expect(rank.getPoints()).to.equal(1);

    rank.setExp(999);

    expect(rank.getExp()).to.equal(999);
    expect(verifyLevel(rank)).to.be.true;

    rank.setPoints(6545);
    expect(rank.getPoints()).to.equal(6545);
  });
});
