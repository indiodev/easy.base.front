/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { Reorder, useDragControls } from 'framer-motion';

import { GripVertical } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

const TableFieldOrder = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();

	const [columns, setColumns] = React.useState<
		{ _id: string; title: string }[]
	>([]);

	const { data: column_list, status: column_list_status } =
		useColumnFindManyByTableIdQuery({
			tableId: params?.id || '',
		});

	React.useEffect(() => {
		if (column_list_status === 'success') {
			setColumns(column_list.map(({ _id, title }) => ({ _id, title })));
		}
	}, [column_list, column_list_status]);

	const control = useDragControls();

	return (
		<Dialog
			modal
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
			}}
		>
			<DialogTrigger
				className="hidden"
				ref={ref}
				{...props}
			/>
			<DialogContent className="py-4 px-6">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Ordenar campos da tabela
					</DialogTitle>
				</DialogHeader>

				<section className=" space-y-5">
					<Reorder.Group
						axis="y"
						values={columns}
						onReorder={setColumns}
						className="flex flex-col space-y-1"
					>
						{columns.map((column) => (
							<Reorder.Item
								key={column._id}
								dragListener={false}
								value={column}
								className="inline-flex justify-between px-4 py-2 w-full bg-indigo-500 rounded-lg text-white font-semibold"
								dragControls={control}
							>
								<span>{column.title}</span>
								<GripVertical
									className="cursor-move"
									onPointerDown={(event) => control.start(event)}
								/>
							</Reorder.Item>
						))}
					</Reorder.Group>

					<div className="inline-flex justify-end w-full">
						<DialogClose asChild>
							<Button className="bg-indigo-500 hover:bg-indigo-500 text-white">
								Salvar
							</Button>
						</DialogClose>
					</div>
				</section>
			</DialogContent>
		</Dialog>
	);
});

TableFieldOrder.displayName = 'TableFieldOrder';

export { TableFieldOrder };
