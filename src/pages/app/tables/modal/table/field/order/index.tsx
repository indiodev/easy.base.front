import { OrderColumn } from '@components/global/row/order-column';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { useTable } from '@hooks/use-table';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { useUserUpdateTableMutation } from '@mutation/user/update-table.mutation';
import { AnimatePresence, Reorder } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

import React from 'react';
import { useParams } from 'react-router-dom';

const TableFieldOrder = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const params = useParams();
	const [open, setOpen] = React.useState(false);

	const { findManyColumn } = useTable();
	const columns = findManyColumn(params.id!);

	const { mutateAsync: update_table, status: update_table_status } =
		useUserUpdateTableMutation({
			onSuccess() {
				tanstack.refetchQueries({
					queryKey: [QUERY.USER_PROFILE],
				});

				setOpen(false);
			},
			onError(error) {
				console.error(error);
			},
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

				<form
					className=" space-y-5 "
					onSubmit={(event) => {
						event.preventDefault();
						update_table({
							column_order: {
								form: columns?.map((item) => item._id),
							},
							tableId: params.id!,
						});
					}}
				>
					<Reorder.Group
						axis="y"
						onReorder={(order) => {
							console.log(order);
							// setColumns
						}}
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
						<Button className="bg-blue-500 text-neutral-50 hover:bg-blue-600">
							{update_table_status === 'pending' && (
								<LoaderCircle className="w-6 h-6 animate-spin" />
							)}
							{!(update_table_status === 'pending') && <span>Confirmar</span>}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
});

TableFieldOrder.displayName = 'TableFieldOrder';

export { TableFieldOrder };
