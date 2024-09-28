/* eslint-disable react/prop-types */
import React from 'react';

import { Button as BaseButton } from '@components/ui/button';
import { cn } from '@libs/utils';

export const Button = React.forwardRef<
	React.ElementRef<typeof BaseButton>,
	React.ComponentPropsWithoutRef<typeof BaseButton>
>(({ className, ...props }, ref) => {
	return (
		<li className="flex-1 w-full cursor-pointer flex px-0">
			<BaseButton
				className={cn(
					'pl-6 py-2 shadow-none w-full flex-1 text-neutral-500 justify-start gap-1 text-base font-normal hover:bg-neutral-300/5 [&>span]:hover:text-indigo-500/70 bg-transparent [&>svg]:hover:stroke-indigo-500/70',
					className,
				)}
				ref={ref}
				{...props}
			/>
		</li>
	);
});

Button.displayName = 'Button';
