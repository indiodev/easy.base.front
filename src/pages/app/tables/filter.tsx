import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { Search } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function Filter() {
	const params = useParams();

	const { data: columns, status: columns_status } =
		useColumnFindManyByTableIdQuery({
			tableId: params?.id || '',
		});

	return (
		<aside className="p-4 flex flex-col space-y-3 max-w-xs w-full bg-indigo-100/20 animate-fade-in-left h-auto">
			{columns_status === 'success' &&
				columns?.map(
					(col) =>
						col?.config?.filter && (
							<div
								className="space-y-2 flex flex-col"
								key={col._id}
							>
								<Label>{col.title}</Label>
								<div className="inline-flex items-center relative max-w-96 w-full">
									<Search
										className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
										strokeWidth={1.5}
									/>
									<Input className="pl-9 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white" />
								</div>
							</div>
						),
				)}

			<Button className="bg-indigo-600 hover:bg-indigo-500">Pesquisar</Button>
		</aside>
	);
}
