import { SidebarProvider } from '@components/ui/sidebar';
import { Toaster } from '@components/ui/toaster';
import { tanstack } from '@libs/tanstack';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes';

export function App(): React.ReactElement {
	return (
		<SidebarProvider>
			<QueryClientProvider client={tanstack}>
				<BrowserRouter>
					<Router />
				</BrowserRouter>
				<Toaster />
			</QueryClientProvider>
		</SidebarProvider>
	);
}
