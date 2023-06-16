import { Command } from '@oclif/core';

export default class World extends Command {
  public static description = 'Say hello world';

  public static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ];

  public static flags = {};

  public static args = {};

  public async run(): Promise<void> {
    this.log('hello world! (./src/commands/hello/world.ts)');
  }
}
