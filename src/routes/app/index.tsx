import { TableProvider } from '@context/table.context';
import { Layout } from '@layouts/index';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const DashboardRouter = React.lazy(async function () {
	const module = await import('./dashboard');
	return {
		default: module.Router,
	};
});

const FormRouter = React.lazy(async function () {
	const module = await import('./forms');
	return {
		default: module.Router,
	};
});

const NotificationRouter = React.lazy(async function () {
	const module = await import('./notifications');
	return {
		default: module.Router,
	};
});

const UserRouter = React.lazy(async function () {
	const module = await import('./users');
	return {
		default: module.Router,
	};
});

const SettingRouter = React.lazy(async function () {
	const module = await import('./settings');
	return {
		default: module.Router,
	};
});

const ProfileRouter = React.lazy(async function () {
	const module = await import('./profile');
	return {
		default: module.Router,
	};
});

const TableRouter = React.lazy(async function () {
	const module = await import('./table');
	return {
		default: module.Router,
	};
});

export function Router(): React.ReactElement {
	return (
		<Routes>
			<Route
				path="app/*"
				element={
					<TableProvider>
						<Layout.App />
					</TableProvider>
				}
			>
				<Route
					path="dashboard/*"
					element={<DashboardRouter />}
				/>

				<Route
					path="forms/*"
					element={<FormRouter />}
				/>

				<Route
					path="notifications/*"
					element={<NotificationRouter />}
				/>

				<Route
					path="users/*"
					element={<UserRouter />}
				/>

				<Route
					path="settings/*"
					element={<SettingRouter />}
				/>

				<Route
					path="profile/*"
					element={<ProfileRouter />}
				/>

				<Route
					path="tables/*"
					element={<TableRouter />}
				/>
			</Route>
		</Routes>
	);
}
