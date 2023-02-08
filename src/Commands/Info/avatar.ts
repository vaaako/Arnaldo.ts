import NaldoClient from '../../Struct/NaldoClient';
import { Command, Message } from 'eris';
import { DiscordEmbed } from '../../Utility/DiscordEmbed';
import MessageUtilities from '../../Utility/MessageUtilities';

export default class AvatarCommand extends Command {
	public category = 'Info';

	constructor(client: NaldoClient) {
		super('avatar', (message: Message, args: string[]): void => {

			let user = MessageUtilities.fetchUser(message, args[0]) ?? message.author;

			let userAvatar = user?.avatarURL.replace('jpg', 'png');
			userAvatar = userAvatar?.replace('?size=128', '?size=1024');

			let embed = new DiscordEmbed();
			embed.setTitle(`${user.discriminator} Profile Picture`);
			embed.setImage(userAvatar);
			embed.setUrl(userAvatar);
			embed.setColor(0xca1773);

			message.channel.createMessage(embed.getEmbed());

		}, {
			description: "Mostra sua linda foto de perfil",
			usage: "avatar [user]",
			aliases: [],
		});
	}
}

// Last edit: 07/02/2023 