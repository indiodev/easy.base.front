/* eslint-disable react/prop-types */
import React from 'react';

import { cn } from '@libs/utils';

const Root = React.forwardRef<
	React.ElementRef<'aside'>,
	React.ComponentPropsWithoutRef<'aside'>
>(({ className, ...props }, ref) => (
	<aside
		className={cn(
			'max-w-[16rem] w-full shadow-lg flex-1 relative h-full',
			className,
		)}
		{...props}
		ref={ref}
	/>
));

Root.displayName = 'Root';

export { Root };
