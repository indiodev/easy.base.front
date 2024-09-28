import React from 'react';
import { Route, Routes } from 'react-router-dom';

const FormPage = React.lazy(async function () {
	const module = await import('@pages/app/forms');
	return {
		default: module.Forms,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route path="/*">
				<Route
					index
					element={<FormPage />}
				/>
			</Route>
		</Routes>
	);
}
