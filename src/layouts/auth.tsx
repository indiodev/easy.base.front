import { Loading } from '@components/loading';
import React from 'react';
import { Outlet } from 'react-router-dom';

export function Auth(): React.ReactElement {
	return (
		<React.Suspense
			fallback={<Loading className="flex justify-center items-center" />}
		>
			<Outlet />;
		</React.Suspense>
	);
}
