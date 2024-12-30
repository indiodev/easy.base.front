import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
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
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@components/ui/sidebar';
import { MENU } from '@libs/menu';
import { cn } from '@libs/utils';
import { useUserProfileQuery } from '@query/user/profile.query';
import { AuthStore } from '@store/auth.store';
import { ChevronsLeft, ChevronsRight, ChevronUp, LogOut } from 'lucide-react';
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '../modal';
import { Tables } from './tables';

export function Sidebar() {
	const { toggleSidebar, open, isMobile } = useSidebar();
	const navigate = useNavigate();
	const location = useLocation();
	const auth = AuthStore();
	const newTableButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const { data: user, status: user_status } = useUserProfileQuery();

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
							{MENU.APP.SIDEBAR.map((menu) => {
								const KEY = `${menu.pathname}` as const;
								const hasNotification = menu.pathname === '/app/notifications';

								return (
									<React.Fragment key={KEY}>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
												isActive={location.pathname === menu.pathname}
												onClick={() => {
													if (isMobile) {
														toggleSidebar();
														return;
													}
												}}
											>
												<NavLink to={menu.pathname}>
													<menu.icon className="h-5 w-5 text-foreground" />
													<span className="text-lg text-foreground">
														{menu.label}
													</span>
												</NavLink>
											</SidebarMenuButton>
											{hasNotification && (
												<SidebarMenuBadge className="border h-8 min-w-6 peer-hover/menu-button:text-white peer-data-[active=true]/menu-button:text-white bg-blue-400 text-white">
													24
												</SidebarMenuBadge>
											)}
										</SidebarMenuItem>
										{menu?.hasSeparator && <Separator className="mt-1 mb-1" />}
									</React.Fragment>
								);
							})}
						</SidebarMenu>

						<Tables onClick={() => newTableButtonRef?.current?.click()} />

						<SidebarMenu>
							{(isMobile || !open) && (
								<React.Fragment>
									<Separator className="mt-1 mb-1" />

									{MENU?.APP?.DROPDOWN?.map((menu) => {
										const KEY = `${menu.pathname}` as const;
										return (
											<React.Fragment key={KEY}>
												<SidebarMenuItem>
													<SidebarMenuButton
														asChild
														className="py-6 [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
														isActive={location.pathname === menu.pathname}
														onClick={() => {
															if (isMobile) {
																toggleSidebar();
																return;
															}
														}}
													>
														<NavLink to={menu.pathname}>
															<menu.icon className="h-5 w-5 text-foreground" />
															<span className="text-lg text-foreground">
																{menu.label}
															</span>
														</NavLink>
													</SidebarMenuButton>
												</SidebarMenuItem>
												{menu?.hasSeparator && (
													<Separator className="mt-1 mb-1" />
												)}
											</React.Fragment>
										);
									})}

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

				<SidebarFooter className="bg-blue-500 p-0 rounded-md">
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
										className="w-[--radix-popper-anchor-width] bg-blue-500"
									>
										{MENU.APP.DROPDOWN.map((menu) => {
											const KEY = `${menu.pathname}` as const;
											return (
												<DropdownMenuItem
													asChild
													key={KEY}
												>
													<NavLink
														to={menu.pathname}
														className="space-x-1 group"
													>
														<menu.icon className="h-5 w-5 text-white group-hover:text-foreground" />
														<span className="text-lg text-white group-hover:text-foreground">
															{menu.label}
														</span>
													</NavLink>
												</DropdownMenuItem>
											);
										})}
										<DropdownMenuItem asChild>
											<SidebarMenuButton
												className="py-5 group"
												onClick={() => {
													auth.clear();
													navigate('/', { replace: true });
												}}
											>
												<LogOut className="h-5 w-5 text-white group-hover:text-blue-600" />
												<span className="text-lg text-white group-hover:text-blue-500">
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
