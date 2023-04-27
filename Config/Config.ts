import * as dotenv from 'dotenv'
dotenv.config({ path: './Config/.env' });

export default {
	// token: process.env.TOKEN_TESTS,
	// prefix: '-',

	token: process.env.TOKEN,
	prefix: ']',

	owner: '',

	// -- MongoDB -- //
	mongoUri: process.env.MONGO_URI,
	// mongoUri: process.env.MONGO_URI_TEST,

	NALDO_VIPS: [
		'123', // Owner
		'321', // My friend
	],
	DIRECT_MESSAGES_CHANNEL: '123', // Where to send direct messages

	ee: {
		color: 0xca1773 // 13244275
	}
}
