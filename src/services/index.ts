import AuthService from './auth.service';
import ColumnService from './column.service';
import RowService from './row.service';
import TableService from './table.service';
import UserService from './user.service';

export const Service = {
	auth: new AuthService(),
	table: new TableService(),
	column: new ColumnService(),
	row: new RowService(),
	user: new UserService(),
};
