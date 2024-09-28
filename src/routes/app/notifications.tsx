import React from 'react';
import { Route, Routes } from 'react-router-dom';

const NotificationPage = React.lazy(async function () {
	const module = await import('@pages/app/notifications');
	return {
		default: module.Notifications,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<NotificationPage />}
				/>
			</Route>
		</Routes>
	);
}
