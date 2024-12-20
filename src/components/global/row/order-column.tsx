import { Column } from '@models/column.model';
import { Reorder, useDragControls } from 'framer-motion';
import { GripHorizontalIcon } from 'lucide-react';

export function OrderColumn({ column }: { column: Column }) {
	const controls = useDragControls();

	return (
		<Reorder.Item
			value={column}
			id={column._id}
			initial={{ opacity: 0, x: 30 }}
			animate={{
				opacity: 1,
				// backgroundColor: isSelected ? '#f3f3f3' : '#fff',
				y: 0,
				transition: { duration: 0.15 },
			}}
			exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
			dragListener={false}
			dragControls={controls}
			whileDrag={{ backgroundColor: '#e3e3e3' }}
			className="flex justify-between items-center border border-gray-200 rounded-lg p-3"
		>
			<span>{column.title}</span>
			<GripHorizontalIcon
				className="cursor-grab"
				onPointerDown={(e) => controls.start(e)}
			/>
		</Reorder.Item>
	);
}
