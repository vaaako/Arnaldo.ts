import { Command, Message } from "eris";
import NaldoClient from "../../Struct/NaldoClient";
import { DiscordEmbed } from "../../Utility/DiscordEmbed";
import config from "../../Config/Config";

// @deprecated
export default class IPCommand extends Command {
	public category = 'Info';

	constructor(client: NaldoClient) {
		super('ip', async (message: Message, args: string[]): Promise<void> => {
			if(!args[0]) {
				NaldoClient.replyMessage(message, "Esqueceu de digitar o IP");
				return;
			}


			let ip: string = args[0];
			const res = await fetch('https://ip-api.com/json/'+ip).then((res) => res.json());

			if(res.status === 'fail') {
				NaldoClient.replyMessage(message, "IP inválido");
				return; 
			}

			let embed = new DiscordEmbed()
				embed.setTitle(res.query);
				embed.setDescription(`Internet: \`${res.isp}\` \nCountry: \`${res.country}\` \nRegion: \`${res.region}\` \nCity: \`${res.city}\` \nZip: \`${res.zip}\` \nLatitude: \`${res.lat}\` \nLongitude: \`${res.lon}\` \nTimezone: \`${res.timezone}\` \n`);
				embed.setFooter("Powered by ip-api");
				embed.setColor(config.ee.color);
			NaldoClient.replyMessage(message, embed.getEmbed());

		}, {
			description: "Informações do IP que você digitar",
			usage: "ip <ip>",
			aliases: [],
		});
	}
};
