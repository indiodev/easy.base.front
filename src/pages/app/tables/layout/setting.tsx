import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@components/ui/dropdown-menu';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
	ArrowDownUp,
	Columns2,
	ListPlus,
	Pencil,
	Plus,
	Settings,
	Table,
	Trash,
} from 'lucide-react';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Modal } from '../modal';

export const Setting = React.forwardRef<
	React.ElementRef<typeof DropdownMenuTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
>(({ ...props }, ref) => {
	const params = useParams();

	const editFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const newFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const newRowButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const editTableButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const tableOrderFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const formOrderFieldButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const {
		data: columns,
		// status: columns_status
	} = useColumnFindManyByTableIdQuery({
		tableId: params?.id || '',
	});

	return (
		<React.Fragment>
			<DropdownMenu dir="ltr">
				<DropdownMenuTrigger
					ref={ref}
					{...props}
				>
					<Settings className="w-5 h-5  text-gray-600" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="mr-10">
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Table className="mr-2 h-4 w-4" />
								<span>Tabela</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => {
											newFieldButtonRef?.current?.click();
										}}
									>
										<Plus className="w-4 h-4" />
										<span>Nova coluna</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => {
											tanstack.refetchQueries({
												queryKey: [
													QUERY.COLUMN_FIND_MANY_BY_TABLE_ID,
													params.id,
												],
											});
											newRowButtonRef?.current?.click();
										}}
									>
										<ListPlus className="w-4 h-4" />
										<span>Novo registro</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => tableOrderFieldButtonRef?.current?.click()}
									>
										<ArrowDownUp className="w-4 h-4" />
										<span>Ordenar colunas</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => editTableButtonRef?.current?.click()}
									>
										<Pencil className="w-4 h-4" />
										<span>Editar</span>
									</DropdownMenuItem>

									<DropdownMenuItem className="inline-flex space-x-1 w-full">
										<Trash className="w-4 h-4" />
										<span>Lixeira</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Table className="mr-2 h-4 w-4" />
								<span>Formulário</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										className="inline-flex space-x-1 w-full"
										onClick={() => formOrderFieldButtonRef?.current?.click()}
									>
										<ArrowDownUp className="w-4 h-4" />
										<span>Ordenar campos</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Columns2 className="mr-2 h-4 w-4" />
								<span>Colunas</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
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
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Modal.EditField ref={editFieldButtonRef} />

			<Modal.NewField ref={newFieldButtonRef} />
			<Modal.NewRow ref={newRowButtonRef} />
			<Modal.EditTable ref={editTableButtonRef} />
			<Modal.TableFieldOrder ref={tableOrderFieldButtonRef} />
			<Modal.FormFieldOrder ref={formOrderFieldButtonRef} />
		</React.Fragment>
	);
});

Setting.displayName = 'Setting';
