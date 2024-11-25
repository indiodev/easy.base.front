import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Table } from '@models/table.model';
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

	const [columns, setColumns] = React.useState<Column[]>(() => {
		return (
			tanstack
				.getQueryData<Table[]>([QUERY.TABLE_LIST])
				?.find((table) => table._id === params.id)?.columns ?? []
		);
	});

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
					<DialogDescription className="sr-only">
						Ordenar campos da tabela
					</DialogDescription>
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
								className="inline-flex justify-between px-4 py-2 w-full bg-blue-500 rounded-lg text-white font-semibold"
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
							<Button className="bg-blue-500 hover:bg-blue-500 text-white">
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
