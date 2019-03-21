import { Message } from 'discord.js';

// Run function for all commands will be asynchronous.
type CommandRunFunction = (message: Message, args?: string[]) => Promise<Message>;

// Command type field will always be the following.
type CommandType = 'core' | 'misc' | 'member' | 'mod' | 'dev';

type CommandArgument = 'string' | 'number';

/*
 * There are two command classes exported in this file. The one that should be used is Command.
 *
 * There are special cases (like when a function must send a command but has no access to one
 * without creating a duplicate), so that is when the DummyCommand is used. It is a Command without
 * the mandatory run() function.
 */

interface DummyCommandOptions {
  name: string;
  description: string;
  type: CommandType;
  aliases?: string[];
  usage?: string;

  // String array of what type each argument should be
  args?: CommandArgument[];
  tags?: number;
  details?: string;
}

interface CommandOptions extends DummyCommandOptions {
  run: CommandRunFunction;
}

export class Command {
  // Name of the command.
  private name: string;

  // Description of the command.
  private description: string;

  // Type of the command. Currently is one of the following: [core, member, friends, mod, dev].
  private type: CommandType;

  // Different names to use for the command.
  private aliases: string[] = [];

  /*
   * Guide to use the command. Format is to exclude command name, and simply have argument types.
   * Arguments should be coated accordingly: <mandatory argument>, [optional argument]
   * These arguments can nest upon one another.
   */
  private usage: string = '';

  // Number of required arguments.
  private args: CommandArgument[] = [];

  // Number of required users to tag.
  private tags: number = 0;

  /*
   * More informative description of the command. This field is called when user is calling
   * help prompt on this command.
   */
  private details: string;

  public run: CommandRunFunction;

  public constructor(options: CommandOptions) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });

    if (!this.details) {
      this.details = this.description;
    }
  }

  public getName(): string { return this.name; }

  public getDescription(): string { return this.description; }

  public getType(): string { return this.type; }

  public getAliases(): string[] { return this.aliases; }

  public getUsage(): string { return this.usage; }

  public getArgs(): CommandArgument[] { return this.args; }

  public getTags(): number { return this.tags; }

  public getDetails(): string { return this.details; }

  /**
   * Verifies arguments by checking that args length meets requirements, as well as that
   * the argument types meets requirements.
   */
  public verifyArgs(args: string[]): boolean {
    if (args.length < this.args.length) {
      return false;
    }

    for (let i = 0; i < this.args.length; i += 1) {
      if (this.args[i] === 'number') {
        const arg = parseInt(args[i], 10);
        if (!arg && arg !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Verfifies message by ensuring that number of users tagged meets requirements.
   */
  public verifyTags(message: Message): boolean {
    return message.mentions.users.size >= this.tags;
  }
}

/*
 * Dummy version of Command class, used for some functions that need accessors in a
 * command source file.
 */
export class DummyCommand extends Command {
  public constructor(options: DummyCommandOptions) {
    super({
      ...options,
      run: async (message: Message): Promise<Message> => message,
    });
  }
}

export default {
  Command,
  DummyCommand,
};
