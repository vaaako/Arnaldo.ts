import { Command, Message } from 'eris';
import NaldoClient from '../../Struct/NaldoClient';
import config from '../../Config/Config';
import { DiscordEmbed } from '../../Utility/DiscordEmbed';


export default class AskCommand extends Command {
	public category = 'Fun';

	constructor(client: NaldoClient) {
		super('ask', (message: Message, args: string[]): void => {
			let answers: string[] = [
				"Sim",
				"Claro",
				"Ainda tem dúvidas?",

				"Não",
				"De jeito nenhum",
				"Definitivamente não",

				"Talvez?",
				"Não sei dizer",
				"Ainda não está na hora de saber"
			];

			const question: string = args.join(' ');
			if(!question) {
				message.channel.createMessage({ content: "Você não fez nenhuma pergunta", messageReference: { messageID: message.id } });
				return;
			}


			// Decide answer
			let answer: string = (question.toLowerCase().includes("hotel")) ? "Trivago" : answers[Math.floor(Math.random() * answers.length)];

			let embed = new DiscordEmbed();
			embed.setTitle(question);
			embed.setDescription(answer);
			embed.setColor(config.ee.color);

			message.channel.createMessage("Hmm...").then((sent) => {
				setTimeout(() => {
					sent.delete();
					message.channel.createMessage({
						embed: {
							title: question,
							description: answer,
							color: config.ee.color
						},
						messageReference: { messageID: message.id }
					});
				}, 5000);
			}).catch(() => console.log("Error (Ask) -> Delete message [Ignore]"));
			
		}, {
			description: "Pergunte algo para mim",
			aliases: ['pergunta', 'perguntar', 'question']
		});
	}
}
