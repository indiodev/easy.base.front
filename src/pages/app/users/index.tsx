import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import { useUserListQuery } from '@query/user/list.query';
import { Search } from 'lucide-react';
import { Table } from './table';

export function Users(): React.ReactElement {
	const { data: user_list, status: user_list_status } = useUserListQuery();
	return (
		<section className="flex h-full flex-1 flex-col gap-4 w-full overflow-y-auto">
			<div className="container max-w-full space-y-4 flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
				<h1 className="text-3xl font-medium text-indigo-600">Usuários</h1>

				<Separator />

				<div className="inline-flex w-full space-x-4">
					<Input placeholder="Pesquise aqui" />
					<Button className="bg-indigo-500 text-neutral-50 hover:bg-indigo-600">
						<Search className="w-5 h-5" />
					</Button>
				</div>
				{user_list_status === 'success' && (
					<Table
						data={user_list}
						labels={['Nome', 'Email']}
					/>
				)}
			</div>
		</section>
	);
}
