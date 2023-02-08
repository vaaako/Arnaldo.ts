import NaldoClient from '../../Struct/NaldoClient';
import { Command, GuildChannel, Message, TextChannel } from 'eris';
import GuildMongo, { GuildDB } from '../../Schemas/Guild';
import { DiscordEmbed } from '../../Utility/DiscordEmbed';

export default class UniversalCommand extends Command {
	public category = 'Bot';

	constructor(client: NaldoClient) {
		super('universal', async (message: Message, args: string[]): Promise<void> => {
			// Getting data
			const guildID: string | undefined = message.guildID;
			const data: GuildDB | null = await GuildMongo.findOne({ guildId: guildID });


			if(!args[0]) {
				if(data?.universalChat) {
					NaldoClient.replyMessage(message, `<#${data.universalChat}> é o Cht Universal`);
					return;
				} else {
					NaldoClient.replyMessage(message, `Você precisa mencionar um canal definí-lo como Chat Universal`);
					return;
				}
			}

			let channel: string = args[0].replace(/[<#>]/g, '');
			if((message.channel as TextChannel).guild.channels.find((c) => c.id === channel)) {
				NaldoClient.replyMessage(message, "Esse canal não existe ou eu não tenho permissão pra ver");
				return;
			}

			// Update
			GuildMongo.findOneAndUpdate({ guildId: guildID }, {
				$set: { 'universalChat': channel }
			}).then(() => NaldoClient.replyMessage(message, `<#${channel}> agora é o Chat Universal`));

			let embed = new DiscordEmbed();
			embed.setTitle("Bem vindo(a) ao Chat Universal");
			embed.setDescription("Qualquer mensagem **enviada** aqui também será enviada para **outros servidores** que possuem o **Chat Universal** ativado. \n\n**Cuidado** com o que você vai digitar!");
			embed.setImage('https://imgur.com/AOXqL6c.png');

			GuildMongo.find({}, (err: Error, guilds: Array<GuildDB>): void => {
				if(err) {
					console.log(err);
					return;
				}

				guilds.map((guild: GuildDB): void => {
					// If data is different from the current server, send join message
					if(channel !== data?.universalChat) {
						client.createMessage(channel, `> **\`${(message.channel as GuildChannel).guild.name}\`** se juntou ao chat!`)
						.catch((e) => console.log(`Error (UC) -> This channel don't exist anymore = ${guild.universalChat} from ${guild.guildID}\nError: `+e));
					}
				});
			});
		}, {
			description: "Define um canal para Chat Universal",
			usage: "universal [channel]",
			aliases: [],
			requirements: {
				permissions: {
					"manageChannels": true
				}
			}
		});
	}
}

// Last edit: 08/02/2023 