import debounce from 'debounce-promise';

import { Option } from '@components/ui/multiple-selector';
import { Service } from '@services/index';

export const USER_FIND_MANY_DEBOUNCE = debounce(
	async (query: Partial<{ search: string }>): Promise<Option[]> => {
		const users = await Service.user.list();
		console.log({ query });

		return users?.map((user) => {
			return {
				label: user?.name,
				value: user?._id,
			};
		});
	},
	1000,
);
