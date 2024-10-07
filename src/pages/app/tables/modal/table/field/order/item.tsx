import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export function Item(props: { column: { title: string; _id: string } }) {
	const control = useDragControls();

	return (
		<Reorder.Item
			// key={column._id}
			dragListener={false}
			value={props.column}
			className="inline-flex px-4 py-2 w-full bg-indigo-500 rounded-lg text-white font-semibold"
			dragControls={control}
		>
			<span>{props.column.title}</span>
			<GripVertical onPointerDown={(event) => control.start(event)} />
		</Reorder.Item>
	);
}
