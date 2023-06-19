import { Command } from '@/structs/Command';

export default class World extends Command<typeof World> {
  public static description = 'Say hello world';

  public static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ];

  public async run(): Promise<void> {
    this.log('hello world! (./src/commands/hello/world.ts)');
  }
}
