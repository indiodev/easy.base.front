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

	return (
		<div className="container max-w-full space-y-3 flex-1 w-full border border-blue-100 bg-blue-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
			<h1 className="text-3xl font-medium text-blue-600">Usuários</h1>

			<Separator />

			<section className="inline-flex items-center">
				<div className="flex-1 inline-flex items-center relative w-full">
					<Search
						className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
						strokeWidth={1.5}
					/>
					<Input
						placeholder="Pesquise aqui"
						className="pl-9 border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600"
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

			{user_list_status === 'success' && (
				<Table
					data={user_list}
					labels={['Nome', 'Email']}
				/>
			)}

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
