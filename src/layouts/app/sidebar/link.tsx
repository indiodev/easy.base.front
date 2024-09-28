/* eslint-disable react/prop-types */
import React from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '@libs/utils';
import './style.css';

export const Link = React.forwardRef<
	React.ElementRef<typeof NavLink>,
	React.ComponentPropsWithoutRef<typeof NavLink> & { isActive: boolean }
>(({ className, isActive, ...props }, ref) => {
	return (
		<li className="flex-1 w-full cursor-pointer flex">
			<NavLink
				className={cn(
					'sidebar-link py-2 flex-1 relative w-full flex gap-2 items-center pl-5',
					isActive && 'active-link',
					className,
				)}
				ref={ref}
				{...props}
			/>
		</li>
	);
});

Link.displayName = 'Link';
