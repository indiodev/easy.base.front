import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import {
	ArrowDownUp,
	Database,
	Filter,
	LayoutDashboard,
	LayoutList,
	Newspaper,
	Pencil,
	Search,
	Trash,
} from 'lucide-react';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Modal } from './modal';

export function Header(): React.ReactElement {
	const { id } = useParams();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const filterActive =
		searchParams.has('filtered') && searchParams.get('filtered') !== 'false';

	const layout =
		searchParams.has('view-layout') &&
		searchParams.get('view-layout') === 'grid'
			? 'grid'
			: 'list';

	const [viewLayout, setViewLayout] = React.useState<'grid' | 'list'>(layout);

	const newFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const newRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editTableButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const tableOrderFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const formOrderFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);

	return (
		<React.Fragment>
			<header className="w-full flex justify-between py-3 rounded-lg">
				<section className="inline-flex w-full justify-between items-center">
					<Button
						className={cn(
							'bg-transparent shadow-none text-indigo-600 hover:bg-indigo-50 border border-indigo-200 inline-flex gap-1',
							filterActive && 'bg-indigo-600 text-white hover:bg-indigo-600',
						)}
						onClick={() => {
							if (filterActive) {
								searchParams.set('filtered', 'false');
								setSearchParams(searchParams);
								return;
							}

							setSearchParams((state) => {
								state.set('filtered', 'true');
								return state;
							});
						}}
					>
						<Filter className="w-5 h-5" />
						<span>Filtro</span>
					</Button>

					<div className="inline-flex space-x-2 w-full justify-end">
						<Button
							className="bg-transparent hover:bg-transparent border shadow-none"
							onClick={() => {
								if (viewLayout === 'list') {
									setViewLayout('grid');
									setSearchParams((state) => {
										state.set('view-layout', 'grid');
										return state;
									});
									return;
								}

								setViewLayout('list');
								setSearchParams((state) => {
									state.set('view-layout', 'list');
									return state;
								});
							}}
						>
							{viewLayout === 'list' && (
								<LayoutDashboard className="w-5 h-5  text-gray-600" />
							)}

							{viewLayout === 'grid' && (
								<LayoutList className="w-5 h-5  text-gray-600" />
							)}
						</Button>
						<div className="inline-flex items-center relative max-w-96 w-full">
							<Search
								className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
								strokeWidth={1.5}
							/>
							<Input
								placeholder="Pesquise aqui"
								className="pl-9 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600"
							/>
						</div>

						<DropdownMenu dir="ltr">
							<DropdownMenuTrigger
								className="flex items-center justify-center border"
								asChild
							>
								<Button className="bg-transparent hover:bg-transparent border shadow-none">
									<Database className="w-5 h-5  text-gray-600" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mr-10">
								<DropdownMenuLabel>Tabela</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => {
											newFieldButtonRef?.current?.click();
										}}
									>
										<span>Nova coluna</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => {
											tanstack.refetchQueries({
												queryKey: [QUERY.COLUMN_FIND_MANY_BY_TABLE_ID, id],
											});
											newRowButtonRef?.current?.click();
										}}
									>
										<span>Novo registro</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => tableOrderFieldButtonRef?.current?.click()}
									>
										<ArrowDownUp className="w-4 h-4" />
										<span>Ordenar colunas</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => editTableButtonRef?.current?.click()}
									>
										<Pencil className="w-4 h-4" />
										<span>Editar</span>
									</DropdownMenuItem>

									<DropdownMenuItem className="inline-flex space-x-1 w-full">
										<Trash className="w-4 h-4" />
										<span>Lixeira</span>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu dir="ltr">
							<DropdownMenuTrigger
								className="flex items-center justify-center border"
								asChild
							>
								<Button className="bg-transparent hover:bg-transparent border shadow-none">
									<Newspaper className="w-5 h-5  text-gray-600" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mr-10">
								<DropdownMenuLabel>Formulário</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => formOrderFieldButtonRef?.current?.click()}
									>
										<ArrowDownUp className="w-4 h-4" />
										<span>Ordenar campos</span>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</section>
			</header>
			<Modal.NewField ref={newFieldButtonRef} />
			<Modal.NewRow ref={newRowButtonRef} />
			<Modal.EditTable ref={editTableButtonRef} />
			<Modal.TableFieldOrder ref={tableOrderFieldButtonRef} />
			<Modal.FormFieldOrder ref={formOrderFieldButtonRef} />
		</React.Fragment>
	);
}
