export interface DiscordUser {
	id: string;
	username: string;
	global_name?: string;
	bot?: boolean;
}

export interface DiscordMember {
	user: DiscordUser;
	nick?: string;
	roles: string[];
	joined_at: string;
}

export interface Member {
	id: string;
	username: string;
	displayName: string;
	roles: string[];
}

export interface DiscordRole {
	id: string;
	name: string;
	description: string | null;
	permissions: string;
	position: number;
	color: number;
	colors: {
		primary_color: number;
		secondary_color: number | null;
		tertiary_color: number | null;
	};
	hoist: boolean;
	managed: boolean;
	mentionable: boolean;
	icon: string | null;
	unicode_emoji: string | null;
	flags: number;
}

export interface Role {
	id: string;
	name: string;
	color: number;
	position: number;
}
