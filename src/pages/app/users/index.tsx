import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Separator } from '@components/ui/separator';
import { useUserListQuery } from '@query/user/list.query';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
} from 'lucide-react';
import { Table } from './table';

export function Users(): React.ReactElement {
	const { data: user_list, status: user_list_status } = useUserListQuery();

	if (user_list_status === 'pending') {
		return (
			<Loading className="flex justify-center items-center h-full flex-1" />
		);
	}

	if (user_list_status === 'error') {
		return (
			<section className="flex h-full flex-1 flex-col gap-4 w-full overflow-y-auto">
				<div className="flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
					<h1 className="text-3xl font-medium text-indigo-600">
						Erro ao carregar dados
					</h1>
				</div>
			</section>
		);
	}

	return (
		<div className="container max-w-full space-y-3 flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
			<h1 className="text-3xl font-medium text-indigo-600">Usuários</h1>

			<Separator />

			<section className="inline-flex items-center">
				<div className="flex-1 inline-flex items-center relative w-full">
					<Search
						className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
						strokeWidth={1.5}
					/>
					<Input
						placeholder="Pesquise aqui"
						className="pl-9 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600"
					/>
				</div>

				<div className="flex-1 inline-flex space-x-2 items-center w-full justify-end">
					<span>Resultados por página: </span>
					<Select defaultValue="10">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Selecione uma opção" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
								<SelectItem value="40">40</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</section>

			<Table
				data={user_list}
				labels={['Nome', 'Email']}
			/>

			<section className="inline-flex w-full justify-end">
				<div className="inline-flex space-x-8 items-center">
					<label className="inline-block max-w-32 w-full">
						Página <strong>1</strong> de <strong>100</strong>
					</label>
					<Pagination className="justify-end">
						<PaginationContent>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronsLeft />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronLeft />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronRight />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronsRight />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</section>
		</div>
	);
}
