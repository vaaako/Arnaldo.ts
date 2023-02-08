import { Command, Message } from 'eris';
import NaldoClient from '../../Struct/NaldoClient';

export default class PingCommand extends Command {
	public category = 'Util';

	constructor(client: NaldoClient) {
		super('ping', (message: Message, args: string[]): void => {
			// Reply instead of just send the message
			message.channel.createMessage({ content: ":ping_pong: | Pong!", messageReference: { messageID: message.id } });
		}, {
			description: 'ping pong with the bot',
			aliases: [],
		});
	}

}
