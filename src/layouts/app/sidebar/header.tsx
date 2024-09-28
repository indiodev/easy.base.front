/* eslint-disable react/prop-types */
import React from 'react';

import { cn } from '@libs/utils';

const Header = React.forwardRef<
	React.ElementRef<'header'>,
	React.ComponentPropsWithoutRef<'header'>
>(({ className, ...props }, ref) => {
	return (
		<header
			ref={ref}
			className={cn(
				'py-6 flex items-center justify-center border-b',
				className,
			)}
			{...props}
		/>
	);
});

Header.displayName = 'Header';

export { Header };
