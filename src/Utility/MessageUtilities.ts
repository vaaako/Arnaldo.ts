import { Member, Message, TextChannel, User } from "eris";

export default class MessageUtilities {
	constructor() {}

	public static fetchUser(message: Message, query: string, bot?: boolean): Member | undefined {
		if(!query) return undefined;

		// Find user in guild
		let user: Member | undefined = (message.channel as TextChannel).guild.members
		.find((x: Member) => x.id === query.replace(/[<>@&!']/g, '').replace(/ /g, ''));

		if(user?.bot && bot) return undefined; // Is a bot and don't want bot
		return user;
	}

	public static superSecret(message: string, decrypt?: boolean): string {
		let table: { [key:string]: string; }  = {
			'0': 'O',
			'1': 'L',
			'2': 'Z',
			'3': 'E',
			'7': 'T',
			'8': 'B'
		}

		// Swap values
		if(decrypt) table = Object.fromEntries(Object.entries(table).map((i) => i.reverse()));

		let finalMessage: string = "";

		for(let i=0; i<message.length; i++) {
			let char: string = message[i];
			let charInTable: string | undefined = table[char];

			finalMessage += charInTable || char;
		}

		return finalMessage;
	}

	public static async urlToBuffer(url: string): Promise<Buffer> {
		let fimg = await fetch(url);
		let fimgb = Buffer.from(await fimg.arrayBuffer());

		return fimgb;
	}
}
