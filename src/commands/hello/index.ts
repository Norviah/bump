import { Command } from '@/structs/Command';
import { Args, Flags } from '@oclif/core';

export default class Hello extends Command<typeof Hello> {
  public static description = 'Say hello';

  public static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ];

  public static flags = {
    from: Flags.string({
      char: 'f',
      description: 'Who is saying hello',
      required: true,
    }),
  };

  public static args = {
    person: Args.string({
      description: 'Person to say hello to',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    this.log(`hello ${this.args.person} from ${this.flags.from}! (./src/commands/hello/index.ts)`);
  }
}
