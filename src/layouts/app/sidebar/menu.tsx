/* eslint-disable react/prop-types */
import React from 'react';

import { cn } from '@libs/utils';

export const Menu = React.forwardRef<
	React.ElementRef<'ul'>,
	React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => {
	return (
		<ul
			ref={ref}
			className={cn('', className)}
			{...props}
		/>
	);
});

Menu.displayName = 'Menu';
