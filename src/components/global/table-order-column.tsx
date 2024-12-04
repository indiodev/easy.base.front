import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { Reorder } from 'framer-motion';

// const TableOrderColumn = React.forwardRef<
// 	HTMLTableCellElement,
// 	React.HTMLAttributes<HTMLTableCellElement> & { column: Column }
// >(({ className, column, ...props }, ref) => (
// 	<Reorder.Item
// 		as="th"
// 		value={column}
// 		id={column._id}
// 		initial={{ opacity: 0, y: 30 }}
// 		animate={{
// 			opacity: 1,
// 			y: 0,
// 			transition: { duration: 0.15 },
// 		}}
// 		exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
// 		whileDrag={{ backgroundColor: '#e3e3e3' }}
// 		className={cn(
// 			'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
// 			className,
// 		)}
// 		ref={ref}
// 		{...props}
// 	/>
// ));

// TableOrderColumn.displayName = 'TableOrderColumn';

// export { TableOrderColumn };

interface Props {
	column: Column;
	children: React.ReactNode;
}

export function TableOrderColumn({ column, children }: Props) {
	return (
		<Reorder.Item
			as="th"
			value={column}
			id={column._id}
			initial={{ opacity: 0, y: 30 }}
			animate={{
				opacity: 1,
				y: 0,
				transition: { duration: 0.15 },
			}}
			exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
			whileDrag={{ backgroundColor: '#e3e3e3' }}
			className={cn(
				'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
			)}
		>
			{children}
		</Reorder.Item>
	);
}
