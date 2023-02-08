import { CommandClient, Message, MessageContent } from 'eris';
import config from '../Config/Config';
import Handler from '../Config/Handler';
import mongoose from 'mongoose';


export default class NaldoClient extends CommandClient {
	public constructor() {
		super(config.token as string, {
			// For more intent check: https://abal.moe/Eris/docs/0.17.1/reference
			intents: [ // Just the basic ones
				'guilds',
				'guildMembers',
				'guildMessages',
				'guildMessageReactions',
				'directMessages'
			],
		},
		{
			description: "Bot com nome mas sem sobrenome", // That is not important at all
			prefix: config.prefix,
			owner: config.owner, // Your ID
			ignoreBots: true, // Ignore other bots messages
			ignoreSelf: true, // Ignore self (bot) messages
			defaultHelpCommand: true // If you want default help command add "long description" to commands
		});
	}

	public login(): void {
		Handler.commands(this); // Load Commands
		Handler.events(this); // Load events

		// Login MongoDb
		(async () => {
			await mongoose.connect(config.mongoUri as string, {
				keepAlive: true
			}).then(() => console.log(`\n-> Connected to MongoDB!`)).catch((e: Error) => console.log(e))

		})();


		this.connect(); // Login bot
	}

	public static replyMessage(message: Message, content: any) { // I don't know what to put here
		message.channel.createMessage({ content, messageReference: { messageID: message.id }});
	}
	// public static sendMessage(content: string) {
	// 	message.channel.createMessage({ content: content })
	// }
}

// Make command interface
declare module 'eris' {
	export interface Command {
		category: string,
		client: NaldoClient
	}
}
