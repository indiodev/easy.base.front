import { COLUMN_FORMAT, COLUMN_TYPE } from '@models/base.model';

export const COLUMN_TYPE_LIST: { type: COLUMN_TYPE; label: string }[] = [
	{
		label: 'Texto',
		type: COLUMN_TYPE.SHORT_TEXT,
	},
	{
		label: 'Area de Texto',
		type: COLUMN_TYPE.LONG_TEXT,
	},
	{
		label: 'Dropdown',
		type: COLUMN_TYPE.DROPDOWN,
	},
	// {
	// 	label: 'Arquivo',
	// 	type: COLUMN_TYPE.FILE,
	// },
	{
		label: 'Data',
		type: COLUMN_TYPE.DATE,
	},
];

export const COLUMN_FORMAT_LIST = [
	{
		label: 'Alfanumérico',
		type: COLUMN_FORMAT.ALPHANUMERIC,
	},
	{
		label: 'Inteiro',
		type: COLUMN_FORMAT.INTEGER,
	},
	{
		label: 'Decimal',
		type: COLUMN_FORMAT.DECIMAL,
	},
	{
		label: 'URL',
		type: COLUMN_FORMAT.URL,
	},
];
