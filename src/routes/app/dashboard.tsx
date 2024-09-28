import React from 'react';
import { Route, Routes } from 'react-router-dom';

const DashboardPage = React.lazy(async function () {
	const module = await import('@pages/app/dashboard');
	return {
		default: module.Dashboard,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<DashboardPage />}
				/>
			</Route>
		</Routes>
	);
}
