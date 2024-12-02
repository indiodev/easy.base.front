import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryStore } from '@hooks/use-query';
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
	const { merge } = useQueryStore();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const searchEntries = Object.fromEntries(searchParams);

	const pathnameWithQuery = location.pathname.concat(location.search);

	React.useEffect(() => {
		if (auth.token) {
			navigate(pathnameWithQuery);
		}

		if (Object.keys(searchEntries).length > 0) {
			merge(searchEntries);
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
