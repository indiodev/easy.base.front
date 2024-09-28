import React from 'react';
import { Route, Routes } from 'react-router-dom';

const ProfilePage = React.lazy(async function () {
	const module = await import('@pages/app/profile');
	return {
		default: module.Profile,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<ProfilePage />}
				/>
			</Route>
		</Routes>
	);
}
