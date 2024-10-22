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
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import { useUserTableLayoutMutation } from '@mutation/user/table-layout.mutation';
import { useUserProfileQuery } from '@query/user/profile.query';
import { Filter, LayoutDashboard, LayoutList, Search } from 'lucide-react';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export function Header(): React.ReactElement {
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const { data: user, status: user_status } = useUserProfileQuery();

	const { mutateAsync: update_table_layout } = useUserTableLayoutMutation({
		onSuccess() {
			tanstack.refetchQueries({
				queryKey: [QUERY.USER_PROFILE],
			});
		},
		onError(error) {
			console.error(error);
		},
	});

	const filterActive =
		searchParams.has('filtered') && searchParams.get('filtered') !== 'false';

	const [viewLayout, setViewLayout] = React.useState<'grid' | 'list'>('list');

	React.useEffect(() => {
		if (user_status === 'success' && params.id && user?.config?.table) {
			setViewLayout(user?.config.table[params.id]?.layout);
		}
	}, [params, user, user_status]);

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
						update_table_layout({
							layout: viewLayout === 'list' ? 'grid' : 'list',
							tableId: params.id,
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
