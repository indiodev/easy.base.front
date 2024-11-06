import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Separator } from '@components/ui/separator';
import {
	Sidebar as Root,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@components/ui/sidebar';
import { cn } from '@libs/utils';
import { useTableListQuery } from '@query/table/list.query';
import { useUserProfileQuery } from '@query/user/profile.query';
import { AuthStore } from '@store/auth.store';
import {
	ChevronDown,
	ChevronsLeft,
	ChevronsRight,
	ChevronUp,
	Database,
	Home,
	Inbox,
	LayoutGrid,
	LogOut,
	Plus,
	Settings,
	Table,
	User,
	Users,
} from 'lucide-react';
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from './modal';

export function Sidebar() {
	const { toggleSidebar, open, isMobile } = useSidebar();
	const navigate = useNavigate();
	const location = useLocation();
	const auth = AuthStore();
	const newTableButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const { data: user, status: user_status } = useUserProfileQuery();

	const { data: table_list, status: table_list_status } = useTableListQuery();

	return (
		<React.Fragment>
			<Root
				variant="floating"
				collapsible="icon"
			>
				<SidebarHeader className="bg-blue-100">
					<div
						className={cn(
							'inline-flex w-full justify-end',
							!open && !isMobile && 'justify-center',
						)}
					>
						<Button
							data-sidebar="trigger"
							variant="ghost"
							size="icon"
							className="border border-blue-300 p-0 w-6 h-6"
							onClick={toggleSidebar}
						>
							{open && <ChevronsLeft className="w-5 h-5 text-blue-600" />}
							{!open && <ChevronsRight className="w-5 h-5 text-blue-600" />}
						</Button>
					</div>
					<div className="inline-flex w-full justify-center">
						<div className="py-4">
							<img
								src={open ? '/logo.png' : '/simple-logo.png'}
								alt="Logo Easy base"
								loading="lazy"
								className={cn('w-40 object-cover', !open && 'w-9 h-9')}
							/>
							<h1 className={cn('font-bold text-2xl', open && 'hidden')}>EB</h1>
						</div>
					</div>
				</SidebarHeader>

				<Separator className="w-full bg-blue-600 h-1" />

				<SidebarContent className="bg-blue-50/50">
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
									isActive={location.pathname === '/app/dashboard'}
								>
									<NavLink to="/app/dashboard">
										<Home className="h-5 w-5 text-neutral-600" />
										<span className="text-lg text-neutral-600">Inicio</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>

						<Separator className="mt-1 mb-1" />

						<Collapsible
							className="group/collapsible py-2"
							defaultOpen
						>
							<SidebarGroupLabel
								asChild
								className="p-0 w-full px-2"
							>
								<CollapsibleTrigger>
									<Database className="h-5 w-5" />
									<span className="pl-1 text-lg text-neutral-600 font-normal">
										Tabelas
									</span>
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-5 h-5" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton
											className="py-6"
											onClick={() => newTableButtonRef?.current?.click()}
										>
											<Plus className="h-5 w-5 text-neutral-600" />
											<span className="text-lg text-neutral-600">
												Nova tabela
											</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									{table_list_status === 'success' &&
										table_list.map((table) => (
											<SidebarMenuItem key={table._id}>
												<SidebarMenuButton
													className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
													asChild
													isActive={location.pathname.includes(
														`/app/tables/${table._id}`,
													)}
												>
													<NavLink
														to={{
															pathname: '/app/tables/'.concat(table._id),
														}}
														state={{
															table: table,
														}}
													>
														<Table className="h-5 w-5 text-neutral-600" />
														<span className="text-lg text-neutral-600">
															{table.title}
														</span>
													</NavLink>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
								</SidebarMenu>
							</CollapsibleContent>
						</Collapsible>

						<Separator className="mt-1 mb-1" />

						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
									isActive={location.pathname === '/app/forms'}
								>
									<NavLink to="/app/forms">
										<LayoutGrid className="h-5 w-5 text-neutral-600" />
										<span className="text-lg text-neutral-600">
											Formulários
										</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
									isActive={location.pathname === '/app/notifications'}
								>
									<NavLink to="/app/notifications">
										<Inbox className="h-5 w-5 text-neutral-600" />
										<span className="text-lg text-neutral-600">
											Notificações
										</span>
									</NavLink>
								</SidebarMenuButton>
								<SidebarMenuBadge className="border h-8 min-w-6 peer-hover/menu-button:text-white peer-data-[active=true]/menu-button:text-white bg-blue-400 text-white">
									24
								</SidebarMenuBadge>
							</SidebarMenuItem>

							{(isMobile || !open) && (
								<React.Fragment>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
											isActive={location.pathname === '/app/users'}
										>
											<NavLink to="/app/users">
												<Users className="h-5 w-5 text-neutral-600" />
												<span className="text-lg text-neutral-600">
													Usuários
												</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
											isActive={location.pathname === '/app/settings'}
										>
											<NavLink to="/app/settings">
												<Settings className="h-5 w-5 text-neutral-600" />
												<span className="text-lg text-neutral-600">
													Configurações
												</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
											isActive={location.pathname === '/app/profile'}
										>
											<NavLink to="/app/profile">
												<User className="h-5 w-5 text-neutral-600" />
												<span className="text-lg text-neutral-600">Perfil</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton
											className="py-6"
											onClick={() => {
												auth.clear();
												navigate('/', { replace: true });
											}}
										>
											<LogOut className="h-5 w-5 text-neutral-600" />
											<span className="text-lg text-neutral-600">Sair</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</React.Fragment>
							)}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="bg-blue-600/70 p-0 rounded-md">
					<SidebarMenu>
						{!(isMobile || !open) && (
							<SidebarMenuItem>
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton className="h-14 hover:bg-transparent rounded-md">
											{user_status === 'success' && (
												<React.Fragment>
													<Avatar className="w-10 h-10">
														<AvatarImage
															src="/profile.png"
															loading="lazy"
														/>
														<AvatarFallback>CN</AvatarFallback>
													</Avatar>
													<span className="text-lg text-neutral-100 font-semibold">
														{user?.name?.split(' ')[0]}
													</span>
												</React.Fragment>
											)}

											{!(user_status === 'success') && (
												<React.Fragment>
													<Avatar className="w-10 h-10">
														<AvatarImage
															src="/profile.png"
															loading="lazy"
														/>
														<AvatarFallback>EB</AvatarFallback>
													</Avatar>
													<span className="text-lg text-neutral-100 font-semibold">
														Easy Base
													</span>
												</React.Fragment>
											)}
											<ChevronUp className="ml-auto text-white" />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side="top"
										className="w-[--radix-popper-anchor-width] bg-blue-600/70"
									>
										<DropdownMenuItem asChild>
											<NavLink
												to="/app/profile"
												className="space-x-1 group"
											>
												<User className="h-5 w-5 text-white group-hover:text-blue-600" />
												<span className="text-lg text-white group-hover:text-blue-600">
													Perfil
												</span>
											</NavLink>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<NavLink
												to="/app/users"
												className="space-x-1 group"
											>
												<User className="h-5 w-5 text-white group-hover:text-blue-600" />
												<span className="text-lg text-white group-hover:text-blue-600">
													Usuários
												</span>
											</NavLink>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<NavLink
												to="/app/settings"
												className="space-x-1 group"
											>
												<Settings className="h-5 w-5 text-white group-hover:text-blue-600" />
												<span className="text-lg text-white group-hover:text-blue-600">
													Configurações
												</span>
											</NavLink>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<SidebarMenuButton
												className="py-5 group"
												onClick={() => {
													auth.clear();
													navigate('/', { replace: true });
												}}
											>
												<LogOut className="h-5 w-5 text-white group-hover:text-blue-600" />
												<span className="text-lg text-white group-hover:text-blue-600">
													Sair
												</span>
											</SidebarMenuButton>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarFooter>
			</Root>
			<Modal.NewTable ref={newTableButtonRef} />
		</React.Fragment>
	);
}
