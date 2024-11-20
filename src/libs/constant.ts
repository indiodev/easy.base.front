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
	{
		label: 'Relacionamento',
		type: COLUMN_TYPE.RELATIONAL,
	},
	{
		label: 'Relacionamento (Múltiplo)',
		type: COLUMN_TYPE.MULTI_RELATIONAL,
	},

	{
		label: 'Avaliação (Estrelas)',
		type: COLUMN_TYPE.RATING,
	},

	{
		label: 'Avaliação (Curtidas)',
		type: COLUMN_TYPE.LIKE,
	},
];

export const COLUMN_TEXT_SHORT_FORMAT_LIST = [
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

export const COLUMN_DATE_FORMAT_LIST = [
	{
		label: 'DD/MM/AAAA',
		type: COLUMN_FORMAT['DD_MM_YYYY'],
	},
	{
		label: 'MM/DD/AAAA',
		type: COLUMN_FORMAT['MM_DD_YYYY'],
	},
	{
		label: 'AAAA/MM/DD',
		type: COLUMN_FORMAT['YYYY_MM_DD'],
	},
	{
		label: 'DD/MM/AAAA hh:mm:ss',
		type: COLUMN_FORMAT['DD_MM_YYYY_HH_MM_SS'],
	},
	{
		label: 'MM/DD/AAAA hh:mm:ss',
		type: COLUMN_FORMAT['MM_DD_YYYY_HH_MM_SS'],
	},
	{
		label: 'AAAA/MM/DD hh:mm:ss',
		type: COLUMN_FORMAT['YYYY_MM_DD_HH_MM_SS'],
	},
	{
		label: 'DD-MM-AAAA',
		type: COLUMN_FORMAT['DD_MM_YYYY_DASH'],
	},
	{
		label: 'MM-DD-AAAA',
		type: COLUMN_FORMAT['MM_DD_YYYY_DASH'],
	},
	{
		label: 'AAAA-MM-DD',
		type: COLUMN_FORMAT['YYYY_MM_DD_DASH'],
	},
	{
		label: 'DD-MM-AAAA hh:mm:ss',
		type: COLUMN_FORMAT['DD_MM_YYYY_HH_MM_SS_DASH'],
	},
	{
		label: 'MM-DD-AAAA hh:mm:ss',
		type: COLUMN_FORMAT['MM_DD_YYYY_HH_MM_SS_DASH'],
	},
	{
		label: 'AAAA-MM-DD hh:mm:ss',
		type: COLUMN_FORMAT['YYYY_MM_DD_HH_MM_SS_DASH'],
	},
];
