import { Command } from 'eris';
import { readdirSync } from 'fs';
import NaldoClient from "../Struct/NaldoClient";
import config from './Config'

export default class Handler {
	static counter: string[] = [];

	constructor() {}

	public static commands(client: NaldoClient): void {
		readdirSync('./Commands/').forEach((dir: string): void => {
			const commands: string[] = readdirSync(`./Commands/${dir}/`).filter((file: string) => file.endsWith(".ts")); // Get command files

			for(let file of commands) {
				let commandFiles = require(`../Commands/${dir}/${file}`).default;
				const command = new commandFiles(client); // Import command file

				if(command) {
					const erisCommand: Command = client.registerCommand(command.label, command.execute);

					// Command configuration (only what is needed)
					erisCommand.client      = command.client;
					erisCommand.category    = command.category;
					erisCommand.description = command.description;
					erisCommand.caseInsensitive = true;

					// Admin Config
					if(command.category === 'Admin') {
						erisCommand.requirements.userIDs = config.NALDO_VIPS;
						erisCommand.hidden = true;
					}
					// If command doesn't have usage field, usage it's just type the command
					if(!command.usage) command.usage = command.label; // To not have to use "else"
					erisCommand.usage = `\`${command.usage}\``; // Add usage


					// Register aliases if have
					if(Array.isArray(command.aliases)) command.aliases.forEach((alias: string) => client.registerCommandAlias(alias, command.label));
					
					this.counter.push(file); // Add to counter (I know this is obvius, just commenting for better organization)
				} else {
					console.log(`- ${file} Error -> missing a help.name, or help.name is not a string.`);
					continue;
				}
			}
		});
		console.log(`\n- Loaded ${this.counter.length} Commands -\n`);
		this.counter = []; // Clear counter for events
	}


	public static events(client: NaldoClient): void {
		const load_dir = (dir: string) => {
			const events: string[] = readdirSync(`./Events/${dir}`).filter((file: string) => file.endsWith(".ts")); // Get event files

			for(const file of events) {
				const event = require(`../Events/${dir}/${file}`).default; // Import event file
				let eventName: string = file.split(".")[0];
				client.on(eventName, event.bind(null, client)); // client.on(event, function)

				this.counter.push(eventName);
			}
		}
	
		["client", "guild"].forEach((e) => load_dir(e)); // For each event type, load all
		for(let i = 0; i < this.counter.length; i++) {
			console.log(`${i+1}. ${this.counter[i]} Ready`); // Events ready
		}
		
		console.log(`\n- Loaded ${this.counter.length} Events -`);
		console.log("\nLogging into the BOT...");
	}

}
