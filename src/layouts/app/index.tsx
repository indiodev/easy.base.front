import { Button } from '@components/ui/button';
import { useSidebar } from '@components/ui/sidebar';
import { ChevronsRight } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';

export function App(): React.ReactElement {
	const { toggleSidebar, isMobile } = useSidebar();

	return (
		<React.Fragment>
			<Sidebar />

			<React.Suspense>
				<main className="p-2 flex-1 overflow-hidden h-screen space-y-1">
					{isMobile && (
						<section className="inline-flex w-full justify-start">
							<Button
								data-sidebar="trigger"
								variant="ghost"
								size="icon"
								className="border border-indigo-300 p-0 w-6 h-6"
								onClick={toggleSidebar}
							>
								<ChevronsRight className="w-5 h-5 text-indigo-600" />
							</Button>
						</section>
					)}

					<Outlet />
				</main>
			</React.Suspense>
		</React.Fragment>
	);
}
