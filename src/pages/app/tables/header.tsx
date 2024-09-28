import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { cn } from '@libs/utils';
import { Filter, Search } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export function Header(): React.ReactElement {
	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	return (
		<React.Fragment>
			<header className="w-full flex justify-between py-3 rounded-lg">
				<section className="inline-flex items-center justify-between w-full">
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
				</section>
				{/* <div className="flex gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button className="bg-neutral-50 hover:bg-neutral-50 border border-indigo-200 py-2 px-3 rounded-lg">
									<ClipboardPlus className="w-4 h-4 text-indigo-700" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Criar formulário</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={() => newRowButtonRef.current?.click()}
									className="bg-indigo-700 hover:bg-indigo-600 border border-transparent py-2 px-3 rounded-lg"
								>
									<Plus className="w-4 h-4 text-neutral-50" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Novo registro</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button className="bg-neutral-50 hover:bg-neutral-50 border border-indigo-200 py-2 px-3 rounded-lg">
									<SquarePen className="w-4 h-4 text-indigo-700" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Editar tabela</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button className="bg-neutral-50 hover:bg-neutral-50 border border-red-200 py-2 px-3 rounded-lg">
									<Trash className="w-4 h-4 text-red-700" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Remover tabela</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div> */}
			</header>
			{/* <Modal.NewRow ref={newRowButtonRef} /> */}
		</React.Fragment>
	);
}
