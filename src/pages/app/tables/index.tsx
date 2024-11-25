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
import { Separator } from '@components/ui/separator';
import { useQueryStore } from '@hooks/use-query';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { useUserTableLayoutMutation } from '@mutation/user/table-layout.mutation';
import { useRowPaginateQuery } from '@query/row/paginate.query';
import { useUserProfileQuery } from '@query/user/profile.query';
import {
	Filter as FilterLucideIcon,
	LayoutDashboard,
	LayoutList,
	Search,
} from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Filter } from './filter';
import { Grid } from './layout/grid';
import { List } from './layout/list';
import { Pagination } from './pagination';
import { Setting } from './setting';

export function Tables(): React.ReactElement {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const {
		query: { filter, ...query },
		merge,
	} = useQueryStore();
	delete query.row_id;

	const table = tanstack
		.getQueryData<Table[]>([QUERY.TABLE_LIST])
		?.find((t) => t._id === params.id);

	const { data: row_paginate, status: row_paginate_status } =
		useRowPaginateQuery({
			id: params.id!,
			...query,
		});

	const { data: user, status: user_status } = useUserProfileQuery();

	const {
		mutateAsync: update_table_layout,
		// status: update_table_layout_status,
	} = useUserTableLayoutMutation({
		onSuccess() {
			tanstack.refetchQueries({
				queryKey: [QUERY.USER_PROFILE],
			});
			tanstack.refetchQueries({
				queryKey: [QUERY.ROW_PAGINATE, params.id!, query],
			});
		},
		onError(error) {
			console.error(error);
		},
	});

	const [viewLayout, setViewLayout] = React.useState<'grid' | 'list'>('list');

	const nonExistUserLayout =
		params?.id &&
		table?.config?.layout &&
		user_status === 'success' &&
		!user?.config?.table?.[params!.id!]?.layout;

	const existUserLayout =
		params?.id &&
		user_status === 'success' &&
		user?.config?.table?.[params!.id!]?.layout;

	React.useEffect(() => {
		if (nonExistUserLayout) {
			setViewLayout(table?.config?.layout || 'list');
			return;
		}

		if (existUserLayout) {
			setViewLayout(user?.config?.table?.[params!.id!]?.layout || 'list');
			return;
		}
	}, [existUserLayout, nonExistUserLayout, params, table, user, user_status]);

	return (
		<div className="flex-1 w-full border border-blue-100 bg-blue-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
			<h2 className="text-3xl font-medium text-blue-600">{table?.title}</h2>

			<Separator />

			<header className="w-full inline-flex items-center">
				<section className="inline-flex w-full flex-1 space-x-3">
					<div className="inline-flex items-center relative w-full">
						<Search
							className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
							strokeWidth={1.5}
						/>
						<Input
							placeholder="Pesquise aqui"
							className="pl-9 border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600"
						/>
					</div>

					<Button
						className={cn(
							'bg-transparent shadow-none text-blue-600 hover:bg-blue-50 border border-blue-200 inline-flex gap-1',
							filter === 'active' && 'bg-blue-600 text-white hover:bg-blue-600',
						)}
						onClick={() => {
							if (filter === 'active') {
								merge({ filter: 'inactive' });
							}

							if (filter === 'inactive') {
								merge({ filter: 'active' });
							}

							const state = {
								...location.state,
								table: { ...table, rows: [] },
							};

							navigate(
								{
									pathname: location.pathname,
									search: location.search,
								},
								{
									replace: true,
									state,
								},
							);
						}}
					>
						<FilterLucideIcon className="w-5 h-5" />
						<span>Filtro</span>
					</Button>

					<Button
						className="bg-transparent hover:bg-transparent border shadow-none"
						onClick={() => {
							update_table_layout({
								layout: viewLayout === 'list' ? 'grid' : 'list',
								tableId: params?.id,
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

					<Setting />
				</section>

				<div className="flex-1 inline-flex space-x-2 items-center w-full justify-end">
					<span>Resultados por página: </span>
					<Select
						disabled={row_paginate_status !== 'success'}
						defaultValue={query?.per_page || '10'}
						onValueChange={(value) => {
							merge({ per_page: Number(value), page: 1 });
						}}
					>
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

			<section className="inline-flex space-x-6">
				{filter === 'active' && <Filter />}

				{row_paginate_status === 'success' && viewLayout === 'list' && (
					<List rows={row_paginate?.data || []} />
				)}

				{row_paginate_status === 'success' && viewLayout === 'grid' && (
					<Grid rows={row_paginate?.data || []} />
				)}
			</section>

			<Pagination
				meta={row_paginate?.meta}
				isLoading={row_paginate_status === 'pending'}
			/>
		</div>
	);
}
