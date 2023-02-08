import NaldoClient from '../../Struct/NaldoClient';
import { Command, Message } from 'eris';
import { DiscordEmbed } from '../../Utility/DiscordEmbed';
import config from '../../Config/Config';

export default class ServersCommand extends Command {
	public category = 'Admin';

	constructor(client: NaldoClient) {
		super('servers', (message: Message) : void => {
			let servers: string[] = [];


			client.guilds.forEach((guild) => {
				servers.push(`${guild.name} | \`${guild.id}\`\n`);
				if(guild.id === '1038996674326044722') console.log(guild)
			})

			let embed = new DiscordEmbed();
			embed.setDescription(`${servers.join(' ')} \nEstou em ${servers.length} servidores :)`);
			embed.setColor(config.ee.color);

			message.channel.createMessage(embed.getEmbed());

		}, {
			description: "Servers que estou",
			usage: "servers",
			aliases: [],
			hidden: true,
			requirements: {
				userIDs: config.NALDO_VIPS
			}
		});
	}
}

// Last edit: 08/02/2023 