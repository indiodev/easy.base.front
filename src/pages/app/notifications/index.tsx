import { Pickaxe } from 'lucide-react';

export function Notifications(): React.ReactElement {
	return (
		<div className="flex justify-center items-center h-screen flex-col gap-2">
			<Pickaxe
				strokeWidth={0.5}
				className="animate-bounce w-32 h-32 stroke-blue-500"
			/>
			<h2 className="text-xl font-bold text-blue-500"> Em manutenção</h2>
		</div>
	);
}
