/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
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
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import {
	BetweenHorizontalStart,
	BetweenVerticalStart,
	ChevronsLeftRight,
	Ellipsis,
	Eye,
	Pencil,
	Settings,
	Trash,
} from 'lucide-react';
import React from 'react';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { Modal } from './modal';
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

export function Table({ columns, rows }: Props): React.ReactElement {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const normalizedRow = rows.map(normalizeRows);

	const newFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const removeRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const newRowButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const [draggedColId, setDraggedColId] = React.useState<string | null>(null);
	const [currentColumns, setCurrentColumns] = React.useState(columns);

	const handleDragStart = (
		event: React.DragEvent<HTMLTableCellElement>,
		columnId: string,
	) => {
		event.dataTransfer.setData('text/plain', columnId);
		setDraggedColId(columnId); // Armazena a coluna que está sendo arrastada
	};

	const handleDragEnd = (event: React.DragEvent<HTMLTableCellElement>) => {
		event.dataTransfer.clearData(); // Limpa os dados transferidos
		setDraggedColId(null); // Limpa o estado da coluna arrastada
	};

	const handleDragOver = (event: React.DragEvent<HTMLTableCellElement>) => {
		event.preventDefault(); // Necessário para permitir o "drop"
	};

	const handleDrop = (
		event: React.DragEvent<HTMLTableCellElement>,
		dropColId: string,
	) => {
		event.preventDefault();

		const draggedColId = event.dataTransfer.getData('text/plain');
		if (!draggedColId) return;

		const draggedColIndex = currentColumns.findIndex(
			(col) => col._id === draggedColId,
		);
		const dropColIndex = currentColumns.findIndex(
			(col) => col._id === dropColId,
		);

		// Evita ações desnecessárias se a coluna arrastada e a coluna alvo forem as mesmas
		if (draggedColIndex === dropColIndex) return;

		// Reordena as colunas
		const reorderedColumns = [...currentColumns];
		const [removed] = reorderedColumns.splice(draggedColIndex, 1);
		reorderedColumns.splice(dropColIndex, 0, removed);

		// Atualiza o estado com a nova ordem de colunas
		setCurrentColumns(reorderedColumns);
	};

	return (
		<React.Fragment>
			<Root>
				<TableHeader>
					<TableRow className="bg-indigo-100/30 hover:bg-indigo-100/30">
						<TableHead>ID</TableHead>

						{currentColumns.map(
							(col) =>
								col?.config?.display && (
									<TableHead
										key={col._id}
										draggable
										onDragStart={(e) => handleDragStart(e, col._id)}
										onDragEnd={handleDragEnd}
										onDragOver={handleDragOver}
										onDrop={(e) => handleDrop(e, col._id)}
										className={cn(
											draggedColId === col._id && 'bg-indigo-100',
											draggedColId &&
												!(draggedColId === col._id) &&
												'border-l border-r',
										)}
									>
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
									<DropdownMenuLabel>Tabela</DropdownMenuLabel>
									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem
											className="inline-flex space-x-1 w-full"
											onClick={() => {
												newFieldButtonRef?.current?.click();
											}}
										>
											<BetweenVerticalStart className="w-5 h-5" />
											<span>Adicionar coluna</span>
										</DropdownMenuItem>

										<DropdownMenuItem
											className="inline-flex space-x-1 w-full"
											onClick={() => {
												newRowButtonRef?.current?.click();
											}}
										>
											<BetweenHorizontalStart className="w-5 h-5" />
											<span>Adicionar registro</span>
										</DropdownMenuItem>

										<DropdownMenuItem className="inline-flex space-x-1 w-full">
											<Pencil className="w-4 h-4" />
											<span>Editar</span>
										</DropdownMenuItem>

										<DropdownMenuItem className="inline-flex space-x-1 w-full">
											<Trash className="w-4 h-4" />
											<span>Lixeira</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuLabel>Campos</DropdownMenuLabel>
										<DropdownMenuItem disabled>ID</DropdownMenuItem>
										<DropdownMenuItem disabled>Criador</DropdownMenuItem>

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
			</Root>
			<Modal.NewField ref={newFieldButtonRef} />
			<Modal.EditField ref={editFieldButtonRef} />
			<Modal.RemoveRow ref={removeRowButtonRef} />
			<Modal.EditRow ref={editRowButtonRef} />
			<Modal.NewRow ref={newRowButtonRef} />
		</React.Fragment>
	);
}
