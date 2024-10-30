/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { ChevronsLeftRight, Ellipsis, Eye, Pencil, Trash } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../modal';
import { Setting } from './setting';
interface Props {
	columns: Column[];
	rows: Row[];
}

function normalizeRows(props: Row) {
	const row = { ...props } as any;

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
						<TableHead>ID</TableHead>

						{columns.map(
							(col) =>
								col?.config?.display && (
									<TableHead key={col._id}>
										<div className="inline-flex items-center gap-1">
											<Button
												onClick={() => {
													if (
														searchParams.has(col.slug) &&
														searchParams.get(col.slug) === 'DESC'
													) {
														setSearchParams((state) => {
															state.set(col.slug, 'ASC');
															return state;
														});
														return;
													}

													setSearchParams((state) => {
														state.set(col.slug, 'DESC');
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
						<TableHead>
							<Setting />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{normalizedRow.map(({ value, id }) => (
						<TableRow key={id}>
							<TableCell className="w-[100px]">{id}</TableCell>

							{Object.entries(value).map(([key, val]) => {
								return <TableCell key={`${key}-${id}`}>{val as any}</TableCell>;
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Root>
			<Modal.RemoveRow ref={removeRowButtonRef} />
			<Modal.EditRow ref={editRowButtonRef} />
		</React.Fragment>
	);
}
