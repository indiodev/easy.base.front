import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from '@components/ui/extension/multi-select';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
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

			<div className="grid grid-cols-2 gap-10">
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
								<CardContent className="p-3">
									<p>{row[column.slug!]}</p>
								</CardContent>
							</Card>
						);
					}

					if (column?.type === COLUMN_TYPE.LONG_TEXT) {
						return (
							<div className="flex flex-col space-y-2">
								<Label>{column.title}</Label>
								<Textarea
									key={column._id}
									value={row[column.slug!]}
									disabled
								></Textarea>
							</div>
						);
					}

					if (column?.type === COLUMN_TYPE?.DROPDOWN) {
						return (
							<div className="flex flex-col">
								<Label>{column.title}</Label>
								<MultiSelector
									values={row[column.slug!]}
									onValuesChange={() => {
										console.log('change');
									}}
									loop
									disabled
									// className="cursor-not-allowed"
								>
									<MultiSelectorTrigger>
										<MultiSelectorInput
											// placeholder="Select your framework"
											disabled
											className="p-0"
										/>
									</MultiSelectorTrigger>
									<MultiSelectorContent>
										<MultiSelectorList>
											{column?.config?.options?.map((option) => (
												<MultiSelectorItem
													key={option.value}
													value={option.value}
												>
													{option.value}
												</MultiSelectorItem>
											))}
										</MultiSelectorList>
									</MultiSelectorContent>
								</MultiSelector>
							</div>
						);
					}

					if (column?.type === COLUMN_TYPE.RELATIONAL) {
						console.log(row[column.slug!]);
						return (
							<div className="flex flex-col">
								<Label>{column.title}</Label>
							</div>
						);
					}
				})}
			</div>
		</section>
	);
}
