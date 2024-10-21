import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@components/ui/collapsible';
import { Separator } from '@components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@components/ui/sidebar';
import { useTableListQuery } from '@query/table/list.query';
import { AuthStore } from '@store/auth.store';
import {
	ChevronDown,
	ChevronsLeft,
	ChevronsRight,
	Database,
	Table,
} from 'lucide-react';
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

export function App(): React.ReactElement {
	const { toggleSidebar, open } = useSidebar();
	const navigate = useNavigate();
	const location = useLocation();
	const auth = AuthStore();

	const newTableButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const { data: table_list, status: table_list_status } = useTableListQuery();

	const FALLBACK = <Loading className="flex justify-center items-center" />;

	return (
		<React.Fragment>
			<Sidebar
				variant="floating"
				collapsible="icon"
			>
				<SidebarHeader className="bg-indigo-100">
					<div className="inline-flex w-full justify-end">
						{open && (
							<Button
								data-sidebar="trigger"
								variant="ghost"
								size="icon"
								className="border border-indigo-300"
								onClick={toggleSidebar}
							>
								<ChevronsLeft className="w-5 h-5 text-indigo-600" />
							</Button>
						)}

						{!open && (
							<Button
								data-sidebar="trigger"
								variant="ghost"
								size="icon"
								className="border border-indigo-300"
								onClick={toggleSidebar}
							>
								<ChevronsRight className="w-5 h-5 text-indigo-600" />
							</Button>
						)}
					</div>
					<div className="inline-flex w-full justify-center py-6">
						{open && (
							<img
								src="/logo.png"
								alt="Logo Easy base"
								loading="lazy"
								className="w-40 object-cover"
							/>
						)}
					</div>
				</SidebarHeader>
				<Separator className="w-full bg-indigo-600 h-1" />
				<SidebarContent>
					<SidebarMenuButton asChild>
						<NavLink to="/app/dashboard">
							<Table className="h-5 w-5" />
							<span>Inicio</span>
						</NavLink>
					</SidebarMenuButton>
					<Collapsible
						// defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger>
									<Database className="h-5 w-5" />
									<span>Tabelas</span>
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											{table_list_status === 'success' &&
												table_list.map((table) => (
													<SidebarMenuButton
														key={table._id}
														asChild
													>
														<NavLink
															to={`/app/tables/${table._id}?filtered=false&view-layout=list`}
															// isActive={location.pathname.includes(
															// 	`/app/tables/${table._id}`,
															// )}
														>
															<Table className="h-5 w-5" />
															<span>{table.title}</span>
														</NavLink>
													</SidebarMenuButton>
												))}
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
			<main className="p-2">
				<React.Suspense fallback={FALLBACK}>
					<Outlet />
				</React.Suspense>
			</main>
		</React.Fragment>
	);
}
