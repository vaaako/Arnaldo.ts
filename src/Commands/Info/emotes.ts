import { Command, Message, TextChannel } from "eris";
import NaldoClient from "../../Struct/NaldoClient";
import { DiscordEmbed } from "../../Utility/DiscordEmbed";
import config from "../../Config/Config";

export default class EmotesCommand extends Command {
	public category = 'Info';

	constructor(client: NaldoClient) {
		super('emotes', (message: Message, args: string[]): void => {
			let normal: string[] = [],
				animated: string[] = [];


			const guild = (message.channel as TextChannel).guild;
			guild.emojis.forEach((emoji: any): void => {
				if(emoji.animated)
					animated.push(`<a:${emoji.name}:${emoji.id}>`);
				else
					normal.push(`<:${emoji.name}:${emoji.id}>`);
			});

			let embed = new DiscordEmbed()
				embed.setAuthor(`Emotes em ${guild.name}`, undefined, guild.iconURL || undefined);
				embed.setDescription(`
				**Normal Emotes [${normal.length}]**\n${normal.join(' ')}\n
				**Animated Emotes [${animated.length}]**\n${animated.join(' ')}\n`)

				embed.setFooter("Total de Emotes " + `[${guild.emojis.length}]`)
				embed.setColor(config.ee.color);
			message.channel.createMessage(embed.getEmbed());
		}, {
			description: "Contagem de emotes no servidor",
			usage: "emotes",
			aliases: ['emojis'],
		});
	}
};

// Last edit: 07/02/2023