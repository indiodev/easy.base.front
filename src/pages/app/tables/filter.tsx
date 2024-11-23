import { DateField } from '@components/global/date';
import { DropdownField } from '@components/global/dropdown';
import { LongTextField } from '@components/global/long-text';
import { MultiRelationalField } from '@components/global/multi-relational';
import { RelationalField } from '@components/global/relational';
import { Button } from '@components/ui/button';
import { Form } from '@components/ui/form';
import { useQueryStore } from '@hooks/use-query';
import { COLUMN_TYPE } from '@models/base.model';
import { Column } from '@models/column.model';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

export function Filter() {
	const location = useLocation();
	const query = useQueryStore();

	const columns = location?.state?.table?.columns as Column[];

	// const { data: columns, status: columns_status } =
	// 	useColumnFindManyByTableIdQuery({
	// 		tableId: params?.id || '',
	// 	});

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

		query.merge(payload);

		console.log(payload);
	});

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
								<DateField
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
								<LongTextField
									key={column._id}
									column={column}
								/>
							);
					})}

					<Button className="bg-blue-600 hover:bg-blue-500">Pesquisar</Button>
				</form>
			</section>
		</Form>
	);
}
