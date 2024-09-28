import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UserPage = React.lazy(async function () {
	const module = await import('@pages/app/users');
	return {
		default: module.Users,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<UserPage />}
				/>
			</Route>
		</Routes>
	);
}
