/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { COLUMN_TYPE } from '@models/base.model';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { format } from 'date-fns';
import { Ellipsis, Eye, Pencil, Trash } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../modal';
interface Props {
	columns: Column[];
	rows: Row[];
}

function normalizeRows(props: Row) {
	const row = { ...props };

	const id = row._id;
	delete row.value._id;
	delete row.value.createdAt;
	delete row.value.created_at;
	delete row.value.updatedAt;
	delete row.value.__v;

	const normalized = {
		value: row.value,
		id,
	};

	return normalized;
}

export function Grid({ columns, rows }: Props): React.ReactElement {
	const navigate = useNavigate();
	const location = useLocation();
	// const params = useParams();

	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const normalizedRow = rows.map(normalizeRows);

	const editFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const removeRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editRowButtonRef = React.useRef<HTMLButtonElement | null>(null);

	return (
		<main className="flex-1 w-full flex flex-col  rounded-md gap-4">
			{/* <div className="inline-flex justify-end pr-14 py-2 bg-blue-100/30 hover:bg-blue-100/30 ">
				<Setting />
			</div> */}

			<section className="grid grid-cols-4 gap-4">
				{normalizedRow?.map(({ value, id }) => {
					return (
						<div
							key={id}
							className="flex flex-col space-y-2 bg-blue-200/50 p-4 rounded-lg shadow-md w-full"
						>
							<div className="inline-flex items-center justify-end">
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger className="bg-blue-200 p-1 rounded-full text-blue-600">
										<Ellipsis className="w-4 h-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
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
												setSearchParams((state) => {
													state.set('row_id', id);
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
							</div>

							{columns.map((col, index) => {
								const KEY = col.slug
									?.concat('-')
									.concat(String(index))
									.concat('-')
									.concat(id);

								if (!(col.slug in value))
									return (
										<div
											key={KEY}
											className="space-x-1"
										>
											<strong>{col.title}:</strong>
											N/A
										</div>
									);

								if (col.type === COLUMN_TYPE.RELATIONAL) {
									const slug_relation = col.config.relation!.slug;
									return (
										<div
											key={KEY}
											className="flex flex-col"
										>
											<strong>{col.title}:</strong>
											<Badge variant="secondary">
												{value[col.slug]?.[slug_relation] ?? 'N/A'}
											</Badge>
										</div>
									);
								}

								if (col.type === COLUMN_TYPE.MULTI_RELATIONAL) {
									// console.log('MULTI_RELATIONAL', value[col.slug]);
									const [first, ...rest] = value[col.slug];
									const slug_relation = col.config.relation!.slug;
									return (
										<div
											key={KEY}
											className="flex flex-col"
										>
											<strong>{col.title}:</strong>
											<div className="space-x-2">
												<Badge variant="secondary">
													{first?.[slug_relation] ?? 'N/A'}
												</Badge>
												{rest?.length > 0 && (
													<Badge variant="secondary">
														+{rest?.length} {col?.title}
													</Badge>
												)}
											</div>
										</div>
									);
								}

								if (col.type === COLUMN_TYPE.DROPDOWN) {
									// console.log('DROPDOWN', value[col.slug]);
									return <div key={KEY}>{value[col.slug]}</div>;
								}

								if (col.type === COLUMN_TYPE.DATE) {
									// console.log('DATE', col, value[col.slug]);

									return (
										<div
											key={KEY}
											className="inline-flex space-x-2"
										>
											<strong>{col.title}:</strong>
											<span className="text-md">
												{format(
													new Date(value[col.slug]),
													col?.config?.format || 'dd/MM/yyyy',
												)}
											</span>
										</div>
									);
								}

								if (col.type === COLUMN_TYPE.LONG_TEXT) {
									return (
										<div
											key={KEY}
											className="flex flex-col"
										>
											<strong>{col.title}:</strong>
											<span>{value[col.slug]}</span>
										</div>
									);
								}

								if (col.type === COLUMN_TYPE.SHORT_TEXT) {
									return (
										<div
											key={KEY}
											className="flex flex-col"
										>
											<strong>{col.title}:</strong>
											<span>{value[col.slug]}</span>
										</div>
									);
								}
							})}
						</div>
					);
				})}

				<Modal.EditField ref={editFieldButtonRef} />
				<Modal.RemoveRow ref={removeRowButtonRef} />
				<Modal.EditRow ref={editRowButtonRef} />
			</section>
		</main>
	);
}
