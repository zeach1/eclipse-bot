interface CommandInterface {
  name: string;
  description: string;
  type: string;

  aliases?: string[];
  usage?: string;
  args?: number;
  tags?: number;
  details?: string;
}

export default class Command implements CommandInterface {
  // Name of the command.
  public name: string;

  // Description of the command.
  public description: string;

  // Type of the command. Currently is one of the following: [core, member, friends, mod, dev].
  public type: string;

  // Different names to use for the command.
  public aliases: string[];

  /*
   * Guide to use the command. Format is to exclude command name, and simply have argument types.
   * Arguments should be coated accordingly: <mandatory argument>, [optional argument]
   * These arguments can nest upon one another.
   */
  public usage: string;

  // Number of required arguments.
  public args: number;

  // Number of required users to tag.
  public tags: number;

  /*
   * More informative description of the command. This field is called when user is calling
   * help prompt on this command.
   */
  public details: string;

  public constructor(details: CommandInterface) {
    const { name, description, type, aliases, usage, args, tags } = details;

    this.name = name;
    this.description = description;
    this.type = type;
    this.aliases = aliases || [];
    this.usage = usage || '';
    this.args = args || 0;
    this.tags = tags || 0;
    this.details = details || description;
  }
}
