/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { COLUMN_TYPE } from '@models/base.model';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { format } from 'date-fns';
import { ChevronsLeftRight, Ellipsis, Eye, Pencil, Trash } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../modal';
interface Props {
	columns: Column[];
	rows: Row[];
}

function normalizeRows(props: Row) {
	const row = { ...props } as any;

	const id = row._id;
	delete row?.value?._id;
	delete row?.value?.createdAt;
	delete row?.value?.created_at;
	delete row?.value?.updatedAt;
	delete row?.value?.__v;

	const normalized = {
		value: row.value,
		id,
	};

	return normalized;
}

export function List({ columns, rows }: Props): React.ReactElement {
	const navigate = useNavigate();
	const location = useLocation();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const normalizedRow = rows.map(normalizeRows);

	const removeRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editRowButtonRef = React.useRef<HTMLButtonElement | null>(null);

	return (
		<React.Fragment>
			<Root>
				<TableHeader>
					<TableRow className="bg-blue-100/30 hover:bg-blue-100/30">
						<TableHead></TableHead>

						<TableHead>ID</TableHead>

						{columns.map(
							(col) =>
								col?.config?.display && (
									<TableHead key={col._id}>
										<div className="inline-flex items-center gap-1">
											<Button
												onClick={() => {
													const order_slug = 'order-'.concat(col.slug);
													const has_order_desc_slug =
														searchParams.has(order_slug) &&
														searchParams.get(order_slug) === 'desc';

													if (has_order_desc_slug) {
														setSearchParams((state) => {
															state.set(order_slug, 'asc');
															return state;
														});
														return;
													}

													setSearchParams((state) => {
														state.set(order_slug, 'desc');
														return state;
													});
												}}
												className="p-0 bg-transparent shadow-none text-gray-600 hover:bg-transparent border border-transparent hover:border-gray-300"
											>
												<ChevronsLeftRight className="w-4 h-4 rotate-90" />
											</Button>
											<span>{col.title}</span>
										</div>
									</TableHead>
								),
						)}
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{normalizedRow.map(({ value, id }, index) => {
						return (
							<TableRow key={id}>
								<TableCell className="w-[20px] border-r text-center font-bold">
									{index + 1}
								</TableCell>
								<TableCell className="w-[100px]">{id}</TableCell>
								{columns.map((col, index) => {
									const KEY = col.slug
										?.concat('-')
										.concat(String(index))
										.concat('-')
										.concat(id);

									if (!(col.slug in value))
										return (
											<TableCell
												key={KEY}
												className="space-x-2"
											>
												N/A
											</TableCell>
										);

									if (col.type === COLUMN_TYPE.RELATIONAL) {
										const slug_relation = col.config.relation!.slug;
										return (
											<TableCell
												key={KEY}
												className="space-x-2"
											>
												<Badge variant="outline">
													{value[col.slug]?.[slug_relation]}
												</Badge>
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.MULTI_RELATIONAL) {
										// console.log('MULTI_RELATIONAL', value[col.slug]);
										const [first, ...rest] = value[col.slug];
										const slug_relation = col.config.relation!.slug;
										return (
											<TableCell
												key={KEY}
												className="space-x-2"
											>
												<Badge variant="outline">
													{first?.[slug_relation] ?? 'N/A'}
												</Badge>
												{rest?.length > 0 && (
													<Badge variant="outline">
														+{rest?.length} {col?.title}
													</Badge>
												)}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.DROPDOWN) {
										// console.log('DROPDOWN', value[col.slug]);
										return <TableCell key={KEY}>{value[col.slug]}</TableCell>;
									}

									if (col.type === COLUMN_TYPE.DATE) {
										// console.log('DATE', col, value[col.slug]);

										return (
											<TableCell key={KEY}>
												{format(
													new Date(value[col.slug]),
													col?.config?.format || 'dd/MM/yyyy',
												)}
											</TableCell>
										);
									}

									if (col.type === COLUMN_TYPE.LONG_TEXT) {
										return <TableCell key={KEY}>{value[col.slug]}</TableCell>;
									}

									if (col.type === COLUMN_TYPE.SHORT_TEXT) {
										return <TableCell key={KEY}>{value[col.slug]}</TableCell>;
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
															.concat(id),
													});
												}}
											>
												<Eye className="w-4 h-4" />
												<span>Visualizar</span>
											</DropdownMenuItem>

											<DropdownMenuItem
												className="inline-flex space-x-1 w-full"
												onClick={() => {
													const state = {
														...location?.state,
														row: {
															...location?.state?.row,
															id,
															data: Object.entries(value).map(
																([key, value]) => {
																	const column = columns.find(
																		(col) => col.slug === key,
																	);
																	return {
																		path: key,
																		value,
																		column,
																	};
																},
															),
														},
													};

													navigate(
														{
															pathname: location.pathname,
														},
														{
															state,
														},
													);
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
														state.set('row_id', id);
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
