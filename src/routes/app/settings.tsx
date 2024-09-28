import React from 'react';
import { Route, Routes } from 'react-router-dom';

const SettingPage = React.lazy(async function () {
	const module = await import('@pages/app/settings');
	return {
		default: module.Settings,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<SettingPage />}
				/>
			</Route>
		</Routes>
	);
}
