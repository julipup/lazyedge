import { Command } from 'commander';
import * as Commands from './commands';

const Program = new Command();

// Basic program settings
Program
	.name('lazyedge')
	.description('')
	.version('0.0.1');

// Initializing all commands
Object.values(Commands).forEach((cmd) => {
	if (cmd instanceof Command) {
		Program.addCommand(cmd);
	}
});

export { Program };