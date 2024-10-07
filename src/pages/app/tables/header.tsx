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
import { cn } from '@libs/utils';
import { Filter, Pencil, Search, Settings2, Trash } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from './modal';

export function Header(): React.ReactElement {
	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const newFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const newRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editTableButtonRef = React.useRef<HTMLButtonElement | null>(null);

	return (
		<React.Fragment>
			<header className="w-full flex justify-between py-3 rounded-lg">
				<section className="inline-flex w-full justify-between items-center">
					<Button
						className={cn(
							'bg-transparent shadow-none text-indigo-600 hover:bg-indigo-50 border border-indigo-200 inline-flex gap-1',
							searchParams.has('filtered') &&
								'bg-indigo-600 text-white hover:bg-indigo-600',
						)}
						onClick={() => {
							if (searchParams.has('filtered')) {
								searchParams.delete('filtered');
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
									<Settings2 className="w-5 h-5  text-gray-600" />
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
										<span>Adicionar coluna</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => {
											newRowButtonRef?.current?.click();
										}}
									>
										<span>Adicionar registro</span>
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
					</div>
				</section>
			</header>
			<Modal.NewField ref={newFieldButtonRef} />
			<Modal.NewRow ref={newRowButtonRef} />
			<Modal.EditTable ref={editTableButtonRef} />
		</React.Fragment>
	);
}
