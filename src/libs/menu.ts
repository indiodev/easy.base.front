import {
	HomeIcon,
	InboxIcon,
	LayoutGridIcon,
	LucideIcon,
	SettingsIcon,
	UserIcon,
	UsersIcon,
} from 'lucide-react';

interface Route {
	pathname: string;
	label: string;
	icon: LucideIcon;
	hasSeparator: boolean;
}

interface Context {
	DROPDOWN: Route[];
	SIDEBAR: Route[];
}

const APP: Context = {
	SIDEBAR: [
		{
			hasSeparator: true,
			pathname: '/app/dashboard',
			label: 'Inicio',
			icon: HomeIcon,
		},
		{
			hasSeparator: false,
			pathname: '/app/forms',
			label: 'Formulários',
			icon: LayoutGridIcon,
		},
		{
			hasSeparator: false,
			pathname: '/app/notifications',
			label: 'Notificações',
			icon: InboxIcon,
		},
	],
	DROPDOWN: [
		{
			hasSeparator: false,
			pathname: '/app/users',
			label: 'Usuários',
			icon: UsersIcon,
		},
		{
			hasSeparator: false,
			pathname: '/app/settings',
			label: 'Configurações',
			icon: SettingsIcon,
		},
		{
			hasSeparator: false,
			pathname: '/app/profile',
			label: 'Perfil',
			icon: UserIcon,
		},
	],
} as const;

export const MENU = { APP } as const;
