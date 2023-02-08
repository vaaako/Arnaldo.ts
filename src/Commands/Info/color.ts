import NaldoClient from '../../Struct/NaldoClient';
import { Command, Message } from 'eris';
import { DiscordEmbed } from '../../Utility/DiscordEmbed';

export default class ColorCommand extends Command {
	public category = 'Info';

	constructor(client: NaldoClient) {
		super('color', async (message: Message, args: string[]): Promise<void> => {

			let color: string = args[0];
			if(!color) {
				message.channel.createMessage({ content: "Você não escreveu a cor", messageReference: { messageID: message.id }});
				return;
			}
			color = color.replace(/[^\w\s]/gi, '');
			
			const res = await fetch('https://www.thecolorapi.com/id?hex='+color).then((res) => res.json());
			let embed = new DiscordEmbed();
				embed.addField('Hex',  res.hex.value, true);
				embed.addField('RGB',  res.rgb.value.replace(/[rgb()]/g, ""), true);
				embed.addField('CMYK', res.cmyk.value.replace(/[cmyk()]/g, ""), true);
				embed.addField('HSL',  res.hsl.value.replace(/[hsl()]/g, ""), true );
				embed.addField('HSV',  res.hsv.value.replace(/[hsv()]/g, ""), true );
				embed.addField('XYZ',  res.XYZ.value.replace(/[xyz()]/g, ""), true );

				embed.setImage(`https://serux.pro/rendercolour?hex=${res.hex.clean}&height=100&width=225`);
				embed.setFooter(`Powered by TheColorAPI`);

				embed.setColor(parseInt(`0x${res.hex.clean}`));

			message.channel.createMessage(embed.getEmbed());
		}, {
			description: "Veja algumas informações de alguma cor",
			usage: "color <user>",
			aliases: ['colour', 'cor'],
		});
	}
}

// Last edit: 07/02/2023 