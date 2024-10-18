import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
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
					</div>
				</section>
			</header>
		</React.Fragment>
	);
}
