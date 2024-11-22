import { Button } from '@components/ui/button';
import { PaginationContent, PaginationItem } from '@components/ui/pagination';
import { MetaResponse } from '@models/base.model';
import { Table } from '@models/table.model';
import { QueryStore } from '@store/query.store';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

interface Props {
	meta?: MetaResponse<Table>['meta'];
	isLoading?: boolean;
}

export function Pagination({ meta, isLoading }: Props) {
	const { query, merge } = QueryStore();

	return (
		<section className="inline-flex w-full justify-end">
			<div className="inline-flex space-x-8 items-center">
				<label className="inline-block max-w-48 w-full">
					Página <strong>{query?.page}</strong>
					de <strong>{meta?.last_page || query?.page}</strong>
				</label>
				<PaginationContent className="justify-end">
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							disabled={isLoading || query?.page === 1}
							onClick={() => {
								merge({ page: 1 });
							}}
						>
							<ChevronsLeft />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							disabled={isLoading || query?.page === 1}
							onClick={() => {
								merge({ page: Number(query?.page) - 1 });
							}}
						>
							<ChevronLeft />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							disabled={isLoading || query?.page === meta?.last_page}
							onClick={() => {
								merge({ page: Number(query?.page) + 1 });
							}}
						>
							<ChevronRight />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							disabled={isLoading || query?.page === meta?.last_page}
							onClick={() => {
								merge({ page: Number(meta?.last_page) });
							}}
						>
							<ChevronsRight />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</div>
		</section>
	);
}
