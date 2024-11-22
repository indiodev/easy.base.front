import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthStore } from '@store/auth.store';

const Auth = React.lazy(async function () {
	const module = await import('./auth');
	return {
		default: module.Router,
	};
});

const App = React.lazy(async function () {
	const module = await import('./app');
	return {
		default: module.Router,
	};
});

export function Router(): React.ReactElement {
	const auth = AuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	const pathnameWithQuery = location.pathname.concat(location.search);

	React.useEffect(() => {
		if (auth.token) {
			navigate(pathnameWithQuery);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<React.Fragment>
			<Auth />
			<App />
		</React.Fragment>
	);
}
