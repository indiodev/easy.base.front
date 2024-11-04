/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Separator } from '@components/ui/separator';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import { useUserTableLayoutMutation } from '@mutation/user/table-layout.mutation';
import { useTableShowQuery } from '@query/table/show.query';
import { useUserProfileQuery } from '@query/user/profile.query';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Filter as FilterLucideIcon,
	LayoutDashboard,
	LayoutList,
	Search,
} from 'lucide-react';
import React from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Filter } from './filter';
import { Grid } from './layout/grid';
import { List } from './layout/list';
import { Setting } from './setting';

export function Tables(): React.ReactElement {
	const params = useParams();
	const location = useLocation();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	// const entries = [...searchParams.entries()]
	// 	.filter(([key]) => key !== 'filter')
	// 	.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

	const { data: table, status: table_status } = useTableShowQuery({
		id: params?.id!,
		...(searchParams.get('page') && {
			page: Number(searchParams.get('page') || 1),
		}),
		...(searchParams.get('per_page') && {
			per_page: Number(searchParams.get('per_page') || 10),
		}),
	});

	const { data: user, status: user_status } = useUserProfileQuery();

	const filterActive =
		searchParams.has('filter') && searchParams.get('filter') === 'active';

	const {
		mutateAsync: update_table_layout,
		status: update_table_layout_status,
	} = useUserTableLayoutMutation({
		onSuccess() {
			tanstack.refetchQueries({
				queryKey: [QUERY.USER_PROFILE],
			});
			tanstack.refetchQueries({
				queryKey: [QUERY.TABLE_SHOW, params.id],
			});
		},
		onError(error) {
			console.error(error);
		},
	});

	const [viewLayout, setViewLayout] = React.useState<'grid' | 'list'>('list');

	React.useEffect(() => {
		if (user_status === 'success' && params.id && user?.config?.table) {
			setViewLayout(user?.config.table[params.id]?.layout);
		}
	}, [params, user, user_status]);

	const isPendingTableOrUserData =
		table_status === 'pending' || user_status === 'pending';

	const isListLayout =
		table_status === 'success' &&
		user_status === 'success' &&
		user?.config?.table?.[params?.id!]?.layout === 'list' &&
		!isPendingTableOrUserData;

	const isGridLayout =
		table_status === 'success' &&
		user_status === 'success' &&
		user?.config?.table?.[params?.id!]?.layout === 'grid' &&
		!isPendingTableOrUserData;

	return (
		<div className="flex-1 w-full border border-blue-100 bg-blue-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
			<h2 className="text-3xl font-medium text-blue-600">
				{table?.data?.title}
			</h2>

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
							filterActive && 'bg-blue-600 text-white hover:bg-blue-600',
						)}
						onClick={() => {
							if (filterActive) {
								searchParams.set('filter', 'inactive');
								setSearchParams(searchParams);
								return;
							}

							setSearchParams((state) => {
								state.set('filter', 'active');
								return state;
							});
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

					<Setting />
				</section>

				{table_status === 'success' && table?.meta?.total > 0 && (
					<div className="flex-1 inline-flex space-x-2 items-center w-full justify-end">
						<span>Resultados por página: </span>
						<Select
							defaultValue={searchParams.get('per_page') || '10'}
							onValueChange={(value) => {
								setSearchParams((state) => {
									state.set('page', '1');
									state.set('per_page', value);
									return state;
								});
								tanstack.fetchQuery({
									queryKey: [QUERY.TABLE_SHOW, params.id],
								});
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
				)}
			</header>

			{(isPendingTableOrUserData ||
				update_table_layout_status === 'pending') && (
				<Loading className="flex justify-center items-center h-screen flex-1" />
			)}

			<section className="inline-flex space-x-6">
				{!(update_table_layout_status === 'pending') &&
					!isPendingTableOrUserData &&
					filterActive && <Filter />}
				{!(update_table_layout_status === 'pending') && isListLayout && (
					<List
						columns={table?.data?.columns}
						rows={table?.data?.rows}
					/>
				)}
				{!(update_table_layout_status === 'pending') && isGridLayout && (
					<Grid
						columns={table?.data?.columns}
						rows={table?.data?.rows}
					/>
				)}
			</section>

			{table_status === 'success' && table?.meta?.total > 0 && (
				<section className="inline-flex w-full justify-end">
					<div className="inline-flex space-x-8 items-center">
						<label className="inline-block max-w-32 w-full">
							Página <strong>{table?.meta?.page}</strong> de{' '}
							<strong>{table?.meta?.last_page}</strong>
						</label>
						<Pagination className="justify-end">
							<PaginationContent>
								<PaginationItem>
									<Button
										variant="ghost"
										size="icon"
										className="border"
										onClick={() => {
											setSearchParams((state) => {
												state.set('page', '1');
												return state;
											});

											tanstack.refetchQueries({
												queryKey: [QUERY.TABLE_SHOW, params.id],
											});
										}}
									>
										<ChevronsLeft />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										variant="ghost"
										size="icon"
										className="border"
										onClick={() => {
											if (table?.meta?.page > 1) {
												setSearchParams((state) => {
													state.set('page', String(table?.meta?.page - 1));
													return state;
												});

												tanstack.refetchQueries({
													queryKey: [QUERY.TABLE_SHOW, params.id],
												});
											}
										}}
									>
										<ChevronLeft />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										variant="ghost"
										size="icon"
										className="border"
										onClick={() => {
											if (table?.meta?.page < table?.meta?.last_page) {
												setSearchParams((state) => {
													state.set('page', String(table?.meta?.page + 1));
													return state;
												});

												tanstack.refetchQueries({
													queryKey: [QUERY.TABLE_SHOW, params.id],
												});
											}
										}}
									>
										<ChevronRight />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										variant="ghost"
										size="icon"
										className="border"
										onClick={() => {
											setSearchParams((state) => {
												state.set('page', String(table?.meta?.last_page));
												return state;
											});

											tanstack.refetchQueries({
												queryKey: [QUERY.TABLE_SHOW, params.id],
											});
										}}
									>
										<ChevronsRight />
									</Button>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</section>
			)}
		</div>
	);
}
