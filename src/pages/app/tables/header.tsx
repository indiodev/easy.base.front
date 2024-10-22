import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { cn } from '@libs/utils';
import { Filter, LayoutDashboard, LayoutList, Search } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export function Header(): React.ReactElement {
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

	return (
		<header className="w-full inline-flex items-center">
			<section className="inline-flex w-full flex-1 space-x-3">
				<div className="inline-flex items-center relative w-full">
					<Search
						className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
						strokeWidth={1.5}
					/>
					<Input
						placeholder="Pesquise aqui"
						className="pl-9 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600"
					/>
				</div>

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
			</section>

			<div className="flex-1 inline-flex space-x-2 items-center w-full justify-end">
				<span>Resultados por página: </span>
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Selecione uma opção" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="30">30</SelectItem>
							<SelectItem value="40">40</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</header>
	);
}
