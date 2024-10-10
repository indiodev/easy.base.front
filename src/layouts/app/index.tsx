import { Loading } from '@components/loading';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@components/ui/accordion';
import { Separator } from '@components/ui/separator';
import { useTableListQuery } from '@query/table/list.query';
import { AuthStore } from '@store/auth.store';
import {
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from './modal';
import { Sidebar } from './sidebar';

export function App(): React.ReactElement {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = AuthStore();

	const newTableButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const { data: table_list, status: table_list_status } = useTableListQuery();

	return (
		<section className="flex w-full h-screen overflow-y-hidden">
			<Sidebar.Root className="h-full">
				<Sidebar.Header>
					<img
						src="/logo.png"
						alt="Logo Easy base"
						loading="lazy"
						className="w-40 object-cover"
					/>
				</Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.Link
						to="/app/dashboard"
						isActive={location.pathname === '/app/dashboard'}
					>
						<Home className="h-5 w-5" />
						<span>Início</span>
					</Sidebar.Link>
					<Accordion
						type="single"
						collapsible
						{...(location.pathname.includes('/app/tables') && {
							defaultValue: 'table-items',
						})}
					>
						<AccordionItem value="table-items">
							<AccordionTrigger className="no-underline hover:no-underline px-5 py-2 shadow-none w-full flex-1 text-neutral-500 gap-1 text-base font-normal hover:bg-neutral-300/5 [&>span]:hover:text-indigo-500/70 bg-transparent [&>svg]:hover:stroke-indigo-500/70">
								<div className="flex gap-2">
									<Database className="h-5 w-5" />
									<span className="no-underline">Tabelas</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="p-0">
								<Sidebar.Button
									className="pl-10"
									onClick={() => newTableButtonRef?.current?.click()}
								>
									<Plus className="h-5 w-5" />
									<span>Criar nova tabela</span>
								</Sidebar.Button>
								{table_list_status === 'success' &&
									table_list.map((table) => (
										<Sidebar.Link
											key={table._id}
											to={`/app/tables/${table._id}?filtered=false&view-layout=list`}
											isActive={location.pathname.includes(
												`/app/tables/${table._id}`,
											)}
											className="pl-10"
										>
											<Table className="h-5 w-5" />
											<span>{table.title}</span>
										</Sidebar.Link>
									))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Sidebar.Link
						to="/app/forms"
						isActive={location.pathname === '/app/forms'}
					>
						<LayoutGrid className="h-5 w-5" />
						<span>Formulários</span>
					</Sidebar.Link>
					<Sidebar.Link
						to="/app/notifications"
						isActive={location.pathname === '/app/notifications'}
					>
						<Inbox className="h-5 w-5" />
						<span>Notificações</span>
					</Sidebar.Link>
					<Separator />
					<Sidebar.Link
						to="/app/users"
						isActive={location.pathname === '/app/users'}
					>
						<Users className="h-5 w-5" />
						<span>Usuários</span>
					</Sidebar.Link>
					<Sidebar.Link
						to="/app/settings"
						isActive={location.pathname === '/app/settings'}
					>
						<Settings className="h-5 w-5" />
						<span>Configurações</span>
					</Sidebar.Link>
					<Separator />

					<Sidebar.Link
						to="/app/profile"
						isActive={location.pathname === '/app/profile'}
					>
						<User className="h-5 w-5" />
						<span>Perfil</span>
					</Sidebar.Link>
					<Sidebar.Button
						onClick={() => {
							auth.clear();
							navigate('/', { replace: true });
						}}
					>
						<LogOut className="h-5 w-5" />
						<span>Sair</span>
					</Sidebar.Button>
				</Sidebar.Menu>
			</Sidebar.Root>
			<Modal.NewTable ref={newTableButtonRef} />
			<React.Suspense
				fallback={<Loading className="flex justify-center items-center" />}
			>
				<main className="flex-1 p-10 bg-indigo-50 overflow-y-auto">
					<Outlet />
				</main>
			</React.Suspense>
		</section>
	);
}
