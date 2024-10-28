/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChevronDownIcon, Loader } from 'lucide-react';
import type {
	ContainerProps,
	DropdownIndicatorProps,
	InputProps,
	MultiValueProps,
	NoticeProps,
	OptionProps,
} from 'react-select';
import { components as ComponentSelect } from 'react-select';

import { cn } from '@libs/utils';

export const Option = ({ ...props }: OptionProps) => {
	return (
		<ComponentSelect.Option
			{...props}
			className=""
		>
			<div
				className={cn('overflow-hidden', props.isSelected && 'text-gray-100')}
			>
				<label
					className={cn(
						'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
						props.isSelected && 'text-gray-700',
					)}
				>
					{props.label}
				</label>
			</div>
		</ComponentSelect.Option>
	);
};

export const SelectContainer = ({ ...props }: ContainerProps) => {
	return (
		<ComponentSelect.SelectContainer
			{...props}
			className="w-full"
		/>
	);
};

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
	return (
		<ComponentSelect.DropdownIndicator {...props}>
			<ChevronDownIcon
				className={cn(
					'h-8 w-8 shrink-0  transition-transform duration-500 text-[#292B37] chevron-icon',
					props.isFocused ? 'rotate-180' : 'rotate-0',
					props.isFocused && 'text-orange-500',
				)}
				strokeWidth={1.5}
			/>
		</ComponentSelect.DropdownIndicator>
	);
};

export const LoadingMessage = (props: NoticeProps) => {
	return (
		<ComponentSelect.LoadingMessage {...props}>
			<div className="flex items-center justify-center">
				<Loader
					className="animate-spin text-orange-500"
					size={24}
				/>
				<span className="ml-2">Carregando...</span>
			</div>
		</ComponentSelect.LoadingMessage>
	);
};

export const Input = (props: InputProps) => {
	return (
		<ComponentSelect.Input
			{...props}
			className="focus:shadow-none border border-[#FE7F03] [&>input]:text-[#FE7F03]"
		/>
	);
};

export const MultiValue = (props: MultiValueProps) => {
	return (
		<ComponentSelect.MultiValue
			{...props}
			className="bg-[#FFF2E5] rounded-[0.5rem] border border-[#FE7F03] py-[0.2rem] px-2 flex items-center justify-center gap-2"
		/>
	);
};
