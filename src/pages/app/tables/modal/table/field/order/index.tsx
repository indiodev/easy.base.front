import { OrderColumn } from '@components/global/order-column';
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
import { AnimatePresence, Reorder } from 'framer-motion';

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
			<DialogContent className="py-4 px-6 ">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Ordenar campos da tabela
					</DialogTitle>
					<DialogDescription className="sr-only">
						Ordenar campos da tabela
					</DialogDescription>
				</DialogHeader>

				<section className=" space-y-5 ">
					<Reorder.Group
						axis="y"
						onReorder={setColumns}
						values={columns}
						className="flex flex-col space-y-1 select-none"
					>
						<AnimatePresence initial={false}>
							{columns.map((column) => (
								<OrderColumn
									column={column}
									key={column._id}
								/>
							))}
						</AnimatePresence>
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
