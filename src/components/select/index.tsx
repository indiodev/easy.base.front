import React from 'react';
import AsyncRoot from 'react-select/async';

import {
	DropdownIndicator,
	LoadingMessage,
	Option,
	SelectContainer,
} from './base';

import { Styles } from './style';

const AsyncSelect = React.forwardRef<
	React.ElementRef<typeof AsyncRoot>,
	React.ComponentPropsWithoutRef<typeof AsyncRoot>
>(({ ...props }, ref) => {
	return (
		<AsyncRoot
			ref={ref}
			styles={Styles}
			closeMenuOnSelect={true}
			hideSelectedOptions={false}
			components={{
				Option: Option,
				SelectContainer: SelectContainer,
				DropdownIndicator: DropdownIndicator,
				LoadingMessage: LoadingMessage,
				LoadingIndicator: () => null,
				IndicatorSeparator: () => null,
			}}
			{...props}
		/>
	);
});

AsyncSelect.displayName = 'AsyncSelect';

export { AsyncSelect };
