export type QueryParams = Record<string, string | number>;

export enum STORE {
	AUTH_STORE = 'AUTH_STORE',
}

export enum QUERY {
	TABLE_LIST = 'TABLE_LIST',
	COLUMN_FIND_MANY_BY_TABLE_ID = 'COLUMN_FIND_MANY_BY_TABLE_ID',
	TABLE_SHOW = 'TABLE_SHOW',
	COLUMN_SHOW = 'COLUMN_SHOW',
	ROW_SHOW = 'ROW_SHOW',
	ROW_PAGINATE = 'ROW_PAGINATE',
	ROW_FIND_MANY = 'ROW_FIND_MANY',
	USER_LIST = 'USER_LIST',
	USER_PROFILE = 'USER_PROFILE',
}

export enum COLUMN_TYPE {
	EMPTY = '',
	SHORT_TEXT = 'SHORT_TEXT',
	LONG_TEXT = 'LONG_TEXT',
	DROPDOWN = 'DROPDOWN',
	FILE = 'FILE',
	DATE = 'DATE',
	RELATIONAL = 'RELATIONAL',
	MULTI_RELATIONAL = 'MULTI_RELATIONAL',
	LIKE = 'LIKE',
	RATING = 'RATING',
	TREE = 'TREE',
}

export enum COLUMN_FORMAT {
	// SHORT_TEXT
	ALPHANUMERIC = 'ALPHANUMERIC',
	INTEGER = 'INTEGER',
	DECIMAL = 'DECIMAL',
	URL = 'URL',

	// DATE
	DD_MM_YYYY = 'dd/MM/yyyy',
	MM_DD_YYYY = 'MM/dd/yyyy',
	YYYY_MM_DD = 'yyyy/MM/dd',
	DD_MM_YYYY_HH_MM_SS = 'dd/MM/yyyy HH:mm:ss',
	MM_DD_YYYY_HH_MM_SS = 'MM/dd/yyyy HH:mm:ss',
	YYYY_MM_DD_HH_MM_SS = 'yyyy/MM/dd HH:mm:ss',
	DD_MM_YYYY_DASH = 'dd-MM-yyyy',
	MM_DD_YYYY_DASH = 'MM-dd-yyyy',
	YYYY_MM_DD_DASH = 'yyyy-MM-dd',
	DD_MM_YYYY_HH_MM_SS_DASH = 'dd-MM-yyyy HH:mm:ss',
	MM_DD_YYYY_HH_MM_SS_DASH = 'MM-dd-yyyy HH:mm:ss',
	YYYY_MM_DD_HH_MM_SS_DASH = 'yyyy-MM-dd HH:mm:ss',
}

export interface MetaResponse<T> {
	data: T;
	meta: {
		total: number;
		per_page: number;
		page: number;
		last_page: number;
		first_page: number;
	};
}
