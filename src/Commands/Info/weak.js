import { Command, Message } from "eris";
import NaldoClient from "../../Struct/NaldoClient";
import { DiscordEmbed } from "../../Utility/DiscordEmbed";
import config from "../../Config/Config";

// @deprecated
export default class WeakCommand extends Command {
	public category = 'Info';

	constructor(client: NaldoClient) {
		super('ip', (message: Message, args: string[]): void => {
			const info: string[] = args.slice(0).join(' ').split(","); // Slice args by comma
			var defaultTypes: object = { "normal": 0, "fire": 0, "water": 0, "grass": 0, "electric": 0, "ice": 0, "fighting": 0, "poison": 0, "ground": 0, "flying": 0, "psychic": 0, "bug": 0, "rock": 0, "ghost": 0, "dragon":0, "dark": 0, "steel": 0, "fairy": 0 };

			// PRIMARY
			var PRIMARY: string | undefined   = info[0].trim().toLowerCase();
			var SECONDARY: string | undefined = info[1].trim().toLowerCase();
			var IMAGE: string | undefined;

			// Check if has argument
			if(!PRIMARY) {
				NaldoClient.replyMessage(message, "Você precisa digitar no mínimo uma tipagem");
				return;
			}

			// Check pokemon
			let index = pokedex.findIndex(poke  => poke.name.english.toLowerCase() == PRIMARY);
			if(index>=0) { // Is a pokémon
				let pokemon = pokedex[index]['type']
				IMAGE = `https://www.serebii.net/art/th/${index+1}.png`
				PRIMARY = pokemon[0].toLowerCase();
				(SECONDARY) ? pokemon[1].toLowerCase() : false;
			} else if(!Object.keys(defaultTypes).includes(PRIMARY) && index==-1) { // If isn't a pokemon check primary
				return message.channel.send(LANGUAGE.noExist.replace("$PRIMARY", PRIMARY)); 
			} else if(SECONDARY && !Object.keys(defaultTypes).includes(SECONDARY) || PRIMARY==SECONDARY) { // If isn't a pokemon check secondary
				return SECONDARY=false
			}

			// - TYPES CHECK - //

			// Counting and soming the two types
			// Formating and adding to array
			var WEAK=[], NEUTRAL=[], RESIST=[], IMMUNE=[];
			Object.keys(defaultTypes).forEach((i) => {
				let chart = require('../../files/database/statics/types-weak.json');
				
				let value = 0;
				let type = capitalize(i);

				value+=chart[PRIMARY][i]; // Plus weaks number

				// Multiplying in case PRIMARY is zero
				// If has SECONDARY
				if(SECONDARY) value*=chart[SECONDARY][i];

				if(value==4)
					WEAK.push(`**${type}**`);
				else if(value==2)
					WEAK.push(type);

				else if(value==1)
					NEUTRAL.push(type);

				else if(value==0.25)
					RESIST.push(`**${type}**`);
				else if(value==0.5)
					RESIST.push(type);

				else if(value==0)
					IMMUNE.push(type);
			});
			
			// Choosing TITLE
			// Set Title
			const TITLE = (!SECONDARY) 
			? PRIMARY.toUpperCase()
			: `__${PRIMARY.toUpperCase()} / ${SECONDARY.toUpperCase()}__`;

			let embed = new EmbedBuilder()
				.setTitle(TITLE)
				.addFields(
					{ name: "Weak", value: WEAK.join(", ") },
					{ name: "Neutral", value: NEUTRAL.join(", ") }
				)
				.setThumbnail(IMAGE)
				.setColor(ee.color);
			
			// Just add if has
			(IMMUNE.length>0) ? embed.addFields({ name: "Immune", value: IMMUNE.join(", ") }) : false;
			(RESIST.length>0) ? embed.addFields({ name: "Resist", value: RESIST.join(", ")}) : false;

			message.channel.send({ embeds: [embed] });
		}, {
			description: 'ping pong with the bot',
			aliases: [],
		});
	},
}
