import { expect } from 'chai';
import { describe, it } from 'mocha';

import Command from '../../src/struct/command';

describe('Command class', () => {
  let command = new Command({
    name: 'test',
    description: 'Test command',
    type: 'dev',
  });

  it('should initialize with mandatory properties', () => {
    expect(command).to.have.property('name');
    expect(command).to.have.property('description');
    expect(command).to.have.property('type');
    expect(command).to.have.property('aliases');
    expect(command).to.have.property('usage');
    expect(command).to.have.property('args');
    expect(command).to.have.property('tags');
    expect(command).to.have.property('details');
  });

  it('should have proper values in proper fields', () => {
    expect(command.getName()).to.equal('test');
    expect(command.getDescription()).to.equal('Test command');
    expect(command.getType()).to.equal('dev');
    expect(command.getAliases()).to.have.length(0);
    expect(command.getUsage()).to.equal('');
    expect(command.getArgs()).to.equal(0);
    expect(command.getTags()).to.equal(0);
    expect(command.getDetails()).to.equal(command.getDescription());
  });

  it('should not initialize with an incorrect command type', () => {
    expect(() => {
      command = new Command({
        name: 'test',
        description: 'Test command',
        type: 'notAValidType',
      });
    }).to.throw("test command's type (notAValidType) is not valid.");
  });
});
