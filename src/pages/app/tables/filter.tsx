import { DropdownField } from '@components/global/row/dropdown';
import { FilterDateField } from '@components/global/row/filter-date';
import { LongTextField } from '@components/global/row/long-text';
import { MultiRelationalField } from '@components/global/row/multi-relational';
import { RelationalField } from '@components/global/row/relational';
import { ShortTextField } from '@components/global/row/short-text';
import { Button } from '@components/ui/button';
import {
	CollapseButton,
	Item,
	SubItem,
	Tree,
} from '@components/ui/extension/tree-view/api';
import { Form } from '@components/ui/form';
import { useQueryStore } from '@hooks/use-query';
import { useTable } from '@hooks/use-table';
import { COLUMN_TYPE } from '@models/base.model';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export function Filter() {
	const { merge } = useQueryStore();
	const params = useParams();

	const form = useForm();

	const onSubmit = form.handleSubmit((data) => {
		const payload = Object.entries(data).reduce(
			(acc, [key, value]) => {
				if (value) {
					if (Array.isArray(value) && value.length > 0)
						acc[key] = value.join(',');
					else acc[key] = value;
				}
				return acc;
			},
			{} as { [key: string]: string },
		);

		merge(payload);
	});

	const { findManyColumn } = useTable();
	const columns = findManyColumn(params.id!);

	const elements = [
		{
			id: '1',
			isSelectable: true,
			name: 'Categoria Principal',
			children: [
				{
					id: '2',
					isSelectable: true,
					name: 'app.tsx',
				},
				{
					id: '3',
					isSelectable: true,
					name: 'components',
					children: [
						{
							id: '20',
							isSelectable: true,
							name: 'pages',
							children: [
								{
									id: '21',
									isSelectable: true,
									name: 'interface.ts',
								},
							],
						},
					],
				},
				{
					id: '6',
					isSelectable: true,
					name: 'ui',
					children: [
						{
							id: '7',
							isSelectable: true,
							name: 'carousel.tsx',
						},
					],
				},
			],
		},
	];

	return (
		<Form {...form}>
			<section className="flex flex-col space-y-2 p-4 max-w-xs w-full bg-blue-100/30 animate-fade-in-left rounded-lg">
				<h2 className="text-lg font-semibold text-blue-600">Filtros</h2>
				<form
					className="flex flex-col space-y-3 h-auto"
					onSubmit={onSubmit}
				>
					{columns?.map((column) => {
						if (!column?.config?.filter) return null;

						if (column?.type === COLUMN_TYPE.RELATIONAL) {
							return (
								<RelationalField
									column={column}
									key={column._id}
								/>
							);
						}

						if (column?.type === COLUMN_TYPE.MULTI_RELATIONAL) {
							return (
								<MultiRelationalField
									column={column}
									key={column._id}
								/>
							);
						}

						if (column?.type === COLUMN_TYPE.DATE) {
							return (
								<FilterDateField
									key={column._id}
									column={column}
								/>
							);
						}

						if (column?.type === COLUMN_TYPE.DROPDOWN)
							return (
								<DropdownField
									column={column}
									key={column._id}
								/>
							);

						if (column?.type === COLUMN_TYPE.LONG_TEXT)
							return (
								<LongTextField
									key={column._id}
									column={column}
								/>
							);

						if (column?.type === COLUMN_TYPE.SHORT_TEXT)
							return (
								<ShortTextField
									key={column._id}
									column={column}
								/>
							);
					})}

					<Tree
						className="rounded-md h-60 bg-background overflow-hidden p-2"
						// initialSelectedId="21"
						// elements={elements}
					>
						<Item
							element="Categoria Principal"
							value="1"
						>
							<SubItem value="2">
								<p> app.tsx </p>
							</SubItem>
							<Item
								value="3"
								element="components"
							>
								<Item
									value="20"
									element="pages"
								>
									<SubItem value="21">
										<p>interface.ts</p>
									</SubItem>
								</Item>
							</Item>
							<Item
								value="6"
								element="ui"
							>
								<SubItem value="7">
									<p>carousel.tsx</p>
								</SubItem>
							</Item>
						</Item>
						<CollapseButton elements={elements} />
					</Tree>

					<Button className="bg-blue-600 hover:bg-blue-500">Pesquisar</Button>
				</form>
			</section>
		</Form>
	);
}
