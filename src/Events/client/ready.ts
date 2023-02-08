import { ActivityPartial, BotActivityType } from "eris";
import NaldoClient from "../../Struct/NaldoClient";

/*
* 0 - Playing
* 1 - Streaming (Twitch only)
* 2 - Listening
* 3 - Watching
* 5 - Competing in
*/

const statuses: ActivityPartial<BotActivityType>[] = [
	{ name: "Castlevania", type: 0 },
	{ name: "Pink Floyd", type: 2 },
	{ name: "My Stream", type: 1, url: "https://twitch.tv/example" }
];


export default (client: NaldoClient) => {
	console.log(`-> Logged in as ${client.user.username}`);

	// online, idle, dnd, invisible
	client.editStatus("idle", statuses);
}