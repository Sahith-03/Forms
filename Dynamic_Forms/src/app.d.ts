// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
import { JwtPayload } from 'jsonwebtoken';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Error{
			code: number;
			message: string;
		}
		interface Locals {
			user?: JwtPayload;
		}
	}
}

export {};
