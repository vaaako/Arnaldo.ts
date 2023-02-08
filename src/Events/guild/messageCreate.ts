import { Message } from "eris";
import NaldoClient from '../../Struct/NaldoClient';
import config from '../../Config/Config'

import GuildMongo, { GuildDB } from '../../Schemas/Guild';
import { DiscordEmbed } from "../../Utility/DiscordEmbed";
import MessageUtilities from "../../Utility/MessageUtilities";

export default async (client: NaldoClient, message: Message): Promise<void> => {
	if(message.author.bot) return; // Ignore bot messages
	if(!message.guildID) { // DM message
		// if(message.author.id === '768125863949893643') // Cavera
		if(message.author.id === config.NALDO_VIPS[0]) return;// From me

		// Send message to channel
		client.createMessage(config.DIRECT_MESSAGES_CHANNEL, `${message.content}\n\n**~>** <@${message.author.id}>`);
		return;
	}

	/*------------------------------------Universal-Chat--------------------------------------------------*/
	const serverID = message.guildID;
	const data = await GuildMongo.findOne({ guildID: serverID as string }) as unknown as GuildDB;

	// If channel is universal chat
	if(data?.universalChat === message.channel.id) {
		if(message.content.startsWith(config.prefix) || message.author.bot) return; // Ignore message

		// Preparing message // 
		let msg = message.content;
		if(msg.length > 250) {
			NaldoClient.replyMessage(message, "O limite de caracteres é de `250`")
			return;
		}

		if(message.referencedMessage) { // Is a reply
			let replyingTo: Message = message.referencedMessage;

			let reply: string = "";
			if(replyingTo.embeds.length > 0) { // Reply is an embed
				reply += replyingTo.embeds[0].description;
			} else if(replyingTo.content) { // Normal message
				reply += replyingTo.content;
			}

			if(replyingTo.attachments.length > 0) { // Has media
				reply += "\n[MEDIA]"
			}

			// Add reply to message
			msg += `\n\n**Replying to: **\`\`\`${reply.replaceAll(/[`*]/g, '')}\`\`\``;
		}

		let embed = new DiscordEmbed();
		embed.setTitle("User-"+MessageUtilities.superSecret(message.author.id));
		embed.setDescription(msg || "");
		embed.setTimestamp();
		embed.setColor(config.ee.color);

		// Check for attachment
		let attachment: Buffer | undefined = undefined; // Default value
		if(message.attachments.length > 0) {
			let url = message.attachments[0].url;

			// If has a video change attachment to url
			(url.slice(-4) === '.mp4')
				? attachment = await MessageUtilities.urlToBuffer(url)
				: embed.setImage(url);
		}

		// Send to all chats
		GuildMongo.find({}, (err: Error, guilds: Array<GuildDB>): void => {
			if(err) {
				console.log(err);
				return;
			}

			guilds.map(async (guild: GuildDB): Promise<void> => {
				let channelID = guild.universalChat;
				if(!channelID) return; // (continue)
				if(channelID === message.channel.id) return;

				client.createMessage(channelID, embed.getEmbed(), { file: attachment as Buffer, name: "Universal_Chat_MEDIA" })
				.catch(() => console.log("Error -> Unable to send Universal Message to "+channelID))
			});
		});
	/*----------------------------------------------------------------------------------------------------*/

	}
}
