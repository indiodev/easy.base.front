/* eslint-disable @typescript-eslint/no-explicit-any */

import { HeadOrderColumn } from '@components/global/table/head-order-column';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
	Table as Root,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@components/ui/table';
import { useQueryStore } from '@hooks/use-query';
import { useTable } from '@hooks/use-table';
import { tanstack } from '@libs/tanstack';
import { COLUMN_FORMAT, COLUMN_TYPE, QUERY } from '@models/base.model';
import { Row } from '@models/row.model';
import { useUserUpdateTableMutation } from '@mutation/user/update-table.mutation';
import { format } from 'date-fns';
import { AnimatePresence, Reorder } from 'framer-motion';
import {
	ChevronsLeftRight,
	Ellipsis,
	Eye,
	Pencil,
	SquareArrowOutUpRightIcon,
	Trash,
} from 'lucide-react';
import React from 'react';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { Modal } from '../modal';
interface Props {
	rows: Row[];
}

export function List({ rows }: Props): React.ReactElement {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const { query, merge } = useQueryStore();

	const removeRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editRowButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const { findManyColumn } = useTable();
	const columns = findManyColumn(params.id!);

	const { mutateAsync: update_table } = useUserUpdateTableMutation({
		onSuccess() {
			tanstack.refetchQueries({
				queryKey: [QUERY.USER_PROFILE],
			});
		},
		onError(error) {
			console.error(error);
		},
	});

	return (
		<React.Fragment>
			<Root>
				<TableHeader>
					<Reorder.Group
						as="tr"
						axis="x"
						onReorder={(order) => {
							// setColumns(order);
							update_table({
								column_order: {
									root: order.map((item) => item._id),
								},
								tableId: params.id!,
							});
						}}
						values={columns}
						className="bg-blue-100/30 hover:bg-blue-100/30"
					>
						<TableHead className="w-[100px]">ID</TableHead>

						<AnimatePresence initial={false}>
							{columns?.map(
								(col) =>
									col?.config?.display && (
										<HeadOrderColumn
											key={col._id}
											column={col}
										>
											<div className="inline-flex items-center space-x-1">
												<Button
													onClick={() => {
														const order_slug = 'order-'.concat(col.slug);
														const has_order_desc_slug =
															query?.[order_slug] === '-1';

														if (has_order_desc_slug) {
															merge({ [order_slug]: '1' });
															return;
														}

														merge({ [order_slug]: '-1' });
													}}
													className="p-0 bg-transparent shadow-none text-gray-600 hover:bg-transparent border border-transparent hover:border-gray-300"
												>
													<ChevronsLeftRight className="w-4 h-4 rotate-90" />
												</Button>
												<span>{col.title}</span>
											</div>
										</HeadOrderColumn>
									),
							)}
							<TableHead className="w-[80px]"></TableHead>
						</AnimatePresence>
					</Reorder.Group>
				</TableHeader>
				<TableBody>
					{rows.map((row) => {
						return (
							<TableRow key={row._id}>
								<TableCell className="w-[100px]">{row._id}</TableCell>

								{columns?.map((col, index) => {
									const KEY = col.slug
										?.concat('-')
										.concat(String(index))
										.concat('-')
										.concat(row._id);

									if (!(col.slug in row))
										return <TableCell key={KEY}>N/A</TableCell>;

									if (col.type === COLUMN_TYPE.FILE) {
										const BASE_URL =
											import.meta.env.VITE_API_BASE_URL ||
											'http://localhost:3333';

										const FIRST_FILE = BASE_URL.concat(
											row[col.slug]?.[0]?.filename,
										);

										return (
											<TableCell key={KEY}>
												<a
													className="inline-flex gap-2 items-center underline"
													target="_blank"
													href={FIRST_FILE}
													rel="noreferrer"
												>
													<SquareArrowOutUpRightIcon className="w-4 h-4" />
													<span>Abrir documento</span>
												</a>
												{/* {!row[col.slug]?.[0] && 'N/A'} */}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.RELATIONAL) {
										const slug_relation = col.config.relation!.slug;
										return (
											<TableCell key={KEY}>
												<Badge variant="outline">
													{row[col.slug]?.[slug_relation] ?? 'N/A'}
												</Badge>
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.MULTI_RELATIONAL) {
										const [first, ...rest] = row[col.slug];
										const slug_relation = col.config.relation!.slug;
										return (
											<TableCell key={KEY}>
												<Badge variant="outline">
													{first?.[slug_relation] || 'N/A'}
												</Badge>
												{rest?.length > 0 && (
													<Badge variant="outline">+{rest?.length}</Badge>
												)}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.DROPDOWN) {
										const [first, ...rest] = row[col.slug];
										if (!col.config?.multiple) {
											return (
												<TableCell key={KEY}>
													<Badge variant="outline">{first ?? 'N/A'}</Badge>
												</TableCell>
											);
										}

										return (
											<TableCell key={KEY}>
												<Badge variant="outline">{first || 'N/A'}</Badge>
												{rest?.length > 0 && (
													<Badge variant="outline">+{rest?.length}</Badge>
												)}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.DATE) {
										return (
											<TableCell key={KEY}>
												{format(
													new Date(row[col.slug]),
													col?.config?.format || 'dd/MM/yyyy',
												)}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.LONG_TEXT) {
										return <TableCell key={KEY}>{row[col.slug]}</TableCell>;
									}

									if (col.type === COLUMN_TYPE.SHORT_TEXT) {
										const format = col?.config?.format;

										if (format === COLUMN_FORMAT.URL) {
											return (
												<TableCell key={KEY}>
													<a
														className="inline-flex gap-2 items-center underline"
														target="_blank"
														href={row[col.slug]}
														rel="noreferrer"
													>
														<SquareArrowOutUpRightIcon className="w-4 h-4" />
														<span>{row[col.slug]}</span>
													</a>
												</TableCell>
											);
										}

										return <TableCell key={KEY}>{row[col.slug]}</TableCell>;
									}
								})}

								<TableCell className="w-[80px]">
									<DropdownMenu
										dir="ltr"
										modal={false}
									>
										<DropdownMenuTrigger className="bg-blue-200 p-1 rounded-full text-blue-600">
											<Ellipsis className="w-4 h-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent className="mr-10">
											<DropdownMenuLabel>Ações</DropdownMenuLabel>
											<DropdownMenuSeparator />

											<DropdownMenuItem
												className="inline-flex space-x-1 w-full"
												onClick={() => {
													navigate({
														pathname: location.pathname
															.concat('/view/')
															.concat(row._id),
													});
												}}
											>
												<Eye className="w-4 h-4" />
												<span>Visualizar</span>
											</DropdownMenuItem>

											<DropdownMenuItem
												className="inline-flex space-x-1 w-full"
												onClick={() => {
													setSearchParams((state) => {
														state.set('row_id', row._id);
														return state;
													});
													editRowButtonRef?.current?.click();
												}}
											>
												<Pencil className="w-4 h-4" />
												<span>Editar</span>
											</DropdownMenuItem>

											<DropdownMenuItem
												className="inline-flex space-x-1 w-full"
												onClick={() => {
													setSearchParams((state) => {
														state.set('row_id', row._id);
														return state;
													});
													removeRowButtonRef?.current?.click();
												}}
											>
												<Trash className="w-4 h-4" />
												<span>Remover</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Root>
			<Modal.RemoveRow ref={removeRowButtonRef} />
			<Modal.EditRow ref={editRowButtonRef} />
		</React.Fragment>
	);
}
