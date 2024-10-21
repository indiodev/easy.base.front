import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useUserListQuery } from '@query/user/list.query';
import { Search } from 'lucide-react';
import { Table } from './table';

export function Users(): React.ReactElement {
	const { data: user_list, status: user_list_status } = useUserListQuery();
	return (
		<div className="container max-w-full space-y-4">
			<h1 className="font-medium text-2xl text-indigo-400">Usuários</h1>
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
	);
}
