import debounce from 'debounce-promise';

import { Option } from '@components/ui/expansion/multiple-selector';
import { Service } from '@services/index';

export const ROW_FIND_MANY_DEBOUNCE = debounce(
	async (query: {
		columnId: string;
		collection: string;
	}): Promise<Option[]> => {
		const rows = await Service.row.findMany(query);

		return rows?.map((row: { _id: string; [key: string]: string | number }) => {
			const field = Object.keys(row).find((key) => key !== '_id');

			if (!field) return;

			return {
				label: row[field] as string,
				value: row._id,
			};
		});
	},
	1000,
);
