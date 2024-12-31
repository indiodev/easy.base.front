/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loading } from '@components/loading';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { useTable } from '@hooks/use-table';
import { COLUMN_TYPE } from '@models/base.model';
import { useRowShowQuery } from '@query/row/show.query';
import { ArrowLeft, ServerOff } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Header(): React.ReactElement {
	const navigate = useNavigate();
	const params = useParams();
	return (
		<div className="inline-flex">
			<Button
				className="bg-transparent shadow-none text-black hover:bg-transparent"
				onClick={() => {
					navigate(-1);
				}}
			>
				<ArrowLeft />
			</Button>
			<h2 className="font-semibold text-2xl">
				Detalhes do registro (id: {params.id})
			</h2>
		</div>
	);
}

export function View(): React.ReactElement {
	const params = useParams();

	const { findManyColumn } = useTable();
	const columns = findManyColumn(params.tableId!);

	const { data: row, status: row_status } = useRowShowQuery({
		id: params.id!,
		tableId: params.tableId!,
	});

	console.log({ row });

	if (row_status === 'pending') {
		return (
			<section className="bg-slate-50 flex-1 flex-col space-y-4 p-6">
				<Header />
				<Loading className="flex flex-1 w-full h-full justify-center items-center" />
			</section>
		);
	}

	if (row_status === 'error') {
		return (
			<section className="bg-slate-50 flex-1 flex-col space-y-4 p-6">
				<Header />
				<div className="flex-1 flex justify-center items-center flex-col gap-6">
					<ServerOff className="w-12 h-12" />
					<h2 className="text-2xl font-semibold">
						Houve um erro ao buscar os dados.
					</h2>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-slate-50 flex-1 flex-col space-y-4 p-6">
			<Header />

			<div className="grid grid-cols-2 gap-4">
				{columns?.map((column) => {
					const KEY = column?._id;
					if (column?.type === COLUMN_TYPE.SHORT_TEXT) {
						return (
							<Card
								key={KEY}
								className="p-0"
							>
								<CardHeader className="p-3">
									<CardTitle>{column?.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-2 pt-0 opacity-70">
									<p>{row[column.slug!]}</p>
								</CardContent>
							</Card>
						);
					}

					if (column?.type === COLUMN_TYPE.LONG_TEXT) {
						return (
							<Card
								key={KEY}
								className="p-0"
							>
								<CardHeader className="p-3">
									<CardTitle>{column?.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-2 pt-0 opacity-70">
									<p>{row[column.slug!]}</p>
								</CardContent>
							</Card>
						);
					}

					if (column?.type === COLUMN_TYPE?.DROPDOWN) {
						return (
							<Card
								key={KEY}
								className="p-0"
							>
								<CardHeader className="p-3">
									<CardTitle>{column?.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-2 pt-0 opacity-70 flex gap-2">
									{((row[column.slug!] ?? []) as string[]).map(
										(item: string) => (
											<Badge
												variant="outline"
												key={item}
											>
												{item}
											</Badge>
										),
									)}
								</CardContent>
							</Card>
						);
					}

					if (column?.type === COLUMN_TYPE.RELATIONAL) {
						const relation_slug = column.config!.relation!.slug;

						const value = row[column.slug!];
						return (
							<Card
								key={KEY}
								className="p-0"
							>
								<CardHeader className="p-3">
									<CardTitle>{column?.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-2 pt-0 opacity-70 flex gap-2">
									<p>{value[relation_slug!]}</p>
								</CardContent>
							</Card>
						);
					}

					if (column?.type === COLUMN_TYPE.MULTI_RELATIONAL) {
						const relation_slug = column.config!.relation!.slug;
						const values = row[column.slug!] as Record<string, any>[];
						return (
							<Card
								key={KEY}
								className="p-0"
							>
								<CardHeader className="p-3">
									<CardTitle>{column?.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-2 pt-0 opacity-70 flex gap-2">
									{values.map((item) => (
										<Badge
											variant="outline"
											key={item._id!}
										>
											{item[relation_slug!]}
										</Badge>
									))}
								</CardContent>
							</Card>
						);
					}
				})}
			</div>
		</section>
	);
}
