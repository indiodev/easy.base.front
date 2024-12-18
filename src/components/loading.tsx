import { cn } from '@libs/utils';
import { LoaderCircle } from 'lucide-react';
import React from 'react';

export function Loading({
	className,
	...props
}: React.ComponentPropsWithoutRef<'section'>): React.ReactElement {
	return (
		<section
			className={cn(
				'flex-1 w-full h-full justify-center items-center',
				className,
			)}
			{...props}
		>
			<LoaderCircle className="w-10 h-10 animate-spin stroke-blue-500" />
		</section>
	);
}
