import { TableContext, TableContextType } from '@context/table.context';
import React from 'react';

export function useTable(): TableContextType {
	const context = React.useContext(TableContext);

	if (!context) throw new Error('useTable must be used within a TableProvider');

	return context;
}
