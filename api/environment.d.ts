declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGO_CONNECTION_STRING: string;
			GOOGLE_CLIENT_ID: string;
			JWT_SECRET: string;
			COOKIE_SESSION_KEY: string;
			FROM_EMAIL: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
