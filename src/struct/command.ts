import { Message } from 'discord.js';

// run function for all commands will be asynchronous.
type RunCommandFunction = (message: Message, args?: string[]) => Promise<Message>;

interface CommandOptions {
  name: string;
  description: string;
  type: string;

  aliases?: string[];
  usage?: string;
  args?: number;
  tags?: number;
  details?: string;

  run: RunCommandFunction;
}

export default class Command {
  // Name of the command.
  private name: string;

  // Description of the command.
  private description: string;

  // Type of the command. Currently is one of the following: [core, member, friends, mod, dev].
  private type: string;

  // Different names to use for the command.
  private aliases: string[] = [];

  /*
   * Guide to use the command. Format is to exclude command name, and simply have argument types.
   * Arguments should be coated accordingly: <mandatory argument>, [optional argument]
   * These arguments can nest upon one another.
   */
  private usage: string = '';

  // Number of required arguments.
  private args: number = 0;

  // Number of required users to tag.
  private tags: number = 0;

  /*
   * More informative description of the command. This field is called when user is calling
   * help prompt on this command.
   */
  private details: string;

  public run: RunCommandFunction;

  public constructor(options: CommandOptions) {
    const keys: string[] = Object.keys(options);

    keys.forEach((key) => {
      if (key === 'type' && !['core', 'misc', 'member', 'mod', 'dev'].includes(options.type)) {
        throw new Error(`${options.name} command's type (${options.type}) is not valid.`);
      }

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

  public getArgs(): number { return this.args; }

  public getTags(): number { return this.tags; }

  public getDetails(): string { return this.details; }
}
