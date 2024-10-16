/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { Ellipsis, Eye, Pencil, Trash } from 'lucide-react';
import React from 'react';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { Modal } from '../modal';
import { Setting } from './setting';
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
	const params = useParams();

	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const normalizedRow = rows.map(normalizeRows);

	const editFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const removeRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editRowButtonRef = React.useRef<HTMLButtonElement | null>(null);

	return (
		<main className="flex-1 w-full flex flex-col  rounded-md gap-4">
			<div className="inline-flex justify-end pr-14 py-2 bg-indigo-100/30 hover:bg-indigo-100/30 ">
				<Setting />
			</div>

			<section className="grid grid-cols-4 gap-4">
				{normalizedRow?.map(({ value, id }) => {
					return (
						<div
							key={id}
							className="flex flex-col space-y-1 bg-indigo-200/50 p-4 rounded-lg shadow-md w-full"
						>
							<div className="inline-flex items-center justify-end">
								<DropdownMenu>
									<DropdownMenuTrigger className="bg-indigo-200 p-1 rounded-full text-indigo-600">
										<Ellipsis className="w-4 h-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>Ações</DropdownMenuLabel>
										<DropdownMenuSeparator />

										<DropdownMenuItem
											className="inline-flex space-x-1 w-full"
											onClick={() => {
												console.log(params);
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
							<div className="space-x-2 pt-2">
								<span>ID</span>:<span>{id}</span>
							</div>
							{Object.entries(value).map(([key, val]) => {
								const column = columns.find((col) => col.slug === key);
								if (!column || !column?.config?.display) return null;

								return (
									<div className="space-x-2">
										<span>{column.title}</span>:<span>{val}</span>
									</div>
								);
							})}
						</div>
					);
				})}
				{/* {columns.map((col) => col?.config?.display && <div>col.title</div>)} */}
				{/* <Root>
				<TableHeader>
					<TableRow className="bg-indigo-100/30 hover:bg-indigo-100/30">
						<TableHead>ID</TableHead>

						{columns.map(
							(col) =>
								col?.config?.display && (
									<TableHead key={col._id}>
										<div className="inline-flex items-center gap-1">
											<Button className="p-0 bg-transparent shadow-none text-gray-600 hover:bg-transparent border border-transparent hover:border-gray-300">
												<ChevronsLeftRight className="w-4 h-4 rotate-90" />
											</Button>
											<span>{col.title}</span>
											<Button
												className="p-0 bg-transparent shadow-none text-gray-600 hover:bg-transparent border border-transparent hover:border-gray-300"
												onClick={() => {
													setSearchParams((state) => {
														state.set('field_id', col._id);
														return state;
													});

													editFieldButtonRef?.current?.click();
												}}
											>
												<Pencil className="w-4 h-4" />
											</Button>
										</div>
									</TableHead>
								),
						)}
						<TableHead className="w-[80px]">
							<DropdownMenu dir="ltr">
								<DropdownMenuTrigger className="w-full flex items-center justify-center">
									<Settings className="w-5 h-5  text-gray-600" />
								</DropdownMenuTrigger>
								<DropdownMenuContent className="mr-10">
									<DropdownMenuGroup>
										<DropdownMenuLabel>Colunas</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											disabled
											className="inline-flex w-full space-x-1"
										>
											<Pencil className="w-4 h-4" />
											<span>ID</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled
											className="inline-flex w-full space-x-1"
										>
											<Pencil className="w-4 h-4" />
											<span>Criador</span>
										</DropdownMenuItem>

										{columns?.map((col) => (
											<DropdownMenuItem
												key={col._id}
												className="inline-flex w-full space-x-1"
												onClick={() => {
													setSearchParams((state) => {
														state.set('field_id', col._id);
														return state;
													});

													editFieldButtonRef?.current?.click();
												}}
											>
												<Pencil className="w-4 h-4" />
												{!col.config?.display && (
													<span className="opacity-50">{col?.title}</span>
												)}

												{col.config?.display && <span>{col?.title}</span>}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
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
								<DropdownMenu>
									<DropdownMenuTrigger className="w-full flex items-center justify-center">
										<Ellipsis className="w-4 h-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>Ações</DropdownMenuLabel>
										<DropdownMenuSeparator />

										<DropdownMenuItem
											className="inline-flex space-x-1 w-full"
											onClick={() => {
												console.log(params);
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
			</Root> */}

				<Modal.EditField ref={editFieldButtonRef} />
				<Modal.RemoveRow ref={removeRowButtonRef} />
				<Modal.EditRow ref={editRowButtonRef} />
			</section>
		</main>
	);
}
