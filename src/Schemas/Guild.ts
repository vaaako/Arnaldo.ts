import { Schema, model } from 'mongoose';

export default model('Guild', new Schema({
	_id: Schema.Types.ObjectId,
	guildId: { type: String, require: true },
	announcementChannel: { type: String, require: false, default: undefined },
	universalChat: { type: String, require: false, default: undefined },
	dinosaurs: { type: Array, require: false, default: [] },
	timeout: {
		dino: {
			rolls: { type: Object, require: false, default: [] },
			marryTimeout: { type: Array, require: false, default: [] }
		}
	}
}, { minimize: false })); // Create empty object

export interface GuildDB {
	guildID: string,
	announcementChannel?: string,
	universalChat?: string,
	dinosaurs?: string[],
}