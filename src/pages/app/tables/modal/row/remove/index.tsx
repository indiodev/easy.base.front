/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@components/ui/dialog';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { useRowDeleteMutation } from '@mutation/row/delete.mutation';

import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const RemoveRow = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();
	const [search] = useSearchParams(new URLSearchParams(location.search));

	const { mutateAsync: remove_row, status: remove_row_status } =
		useRowDeleteMutation({
			onError(error) {
				console.error(error);
			},
			onSuccess() {
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params?.id!],
				});
				setOpen(false);
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
			<DialogContent className="py-4 px-6">
				<section>
					<form className="space-y-4">
						<h2 className="text-center font-semibold text-lg">
							Realmente deseja remover o registro?
						</h2>
						<div className="inline-flex w-full space-x-3 justify-between">
							<DialogClose asChild>
								<Button className="w-full bg-transparent shadow-none border border-red-200 text-red-500 hover:bg-red-50">
									Cancelar
								</Button>
							</DialogClose>
							<Button
								className="w-full bg-red-500 text-neutral-50 hover:bg-red-600"
								type="button"
								onClick={() => {
									remove_row({
										id: search.get('row_id')!,
										tableId: params.id!,
									});
								}}
							>
								{remove_row_status === 'pending' && (
									<LoaderCircle className="w-6 h-6 animate-spin" />
								)}
								{!(remove_row_status === 'pending') && <span>Confirmar</span>}
							</Button>
						</div>
					</form>
				</section>
			</DialogContent>
		</Dialog>
	);
});

RemoveRow.displayName = 'RemoveRow';

export { RemoveRow };
