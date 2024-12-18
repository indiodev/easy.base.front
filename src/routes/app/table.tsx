import { TableProvider } from '@context/table.context';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const TablePage = React.lazy(async function () {
	const module = await import('@pages/app/tables');
	return {
		default: module.Tables,
	};
});

const ViewRowPage = React.lazy(async function () {
	const module = await import('@pages/app/tables/view');
	return {
		default: module.View,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					path=":id"
					element={
						<TableProvider>
							<TablePage />
						</TableProvider>
					}
				/>

				<Route
					path=":tableId/view/:id"
					element={
						<TableProvider>
							<ViewRowPage />
						</TableProvider>
					}
				/>
			</Route>
		</Routes>
	);
}
