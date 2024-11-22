import { Button } from '@components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@components/ui/collapsible';
import {
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@components/ui/sidebar';
import { cn } from '@libs/utils';
import { useTableListQuery } from '@query/table/list.query';
import { ChevronDown, Database, Plus, Table } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tables = React.forwardRef<
	React.ElementRef<typeof SidebarMenuButton>,
	React.ComponentPropsWithoutRef<typeof SidebarMenuButton>
>(({ className, ...props }, ref) => {
	const navigate = useNavigate();

	const { data: table_list, status: table_list_status } = useTableListQuery();

	return (
		<Collapsible
			className="group/collapsible py-2"
			defaultOpen
		>
			<SidebarGroupLabel
				asChild
				className="p-0 w-full px-2"
			>
				<CollapsibleTrigger>
					<Database className="h-5 w-5" />
					<span className="pl-1 text-lg text-neutral-600 font-normal">
						Tabelas
					</span>
					<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-5 h-5" />
				</CollapsibleTrigger>
			</SidebarGroupLabel>
			<CollapsibleContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className={cn('py-6', className)}
							ref={ref}
							{...props}
						>
							<Plus className="h-5 w-5 text-neutral-600" />
							<span className="text-lg text-neutral-600">Nova tabela</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{table_list_status === 'success' &&
						table_list.map((table) => (
							<SidebarMenuItem key={table._id}>
								<SidebarMenuButton
									className="py-6 justify-start shadow-none border bg-primary-foreground [&[data-active=true]]:bg-blue-400 [&[data-active=true]>span]:text-white [&[data-active=true]>svg]:text-white"
									asChild
									isActive={location.pathname.includes(
										`/app/tables/${table._id}`,
									)}
								>
									<Button
										onClick={() => {
											navigate(`/app/tables/${table._id}`, {
												state: {
													table: table,
												},
												replace: true,
											});
										}}
										className="font-normal"
									>
										<Table className="h-5 w-5 text-neutral-600" />
										<span className="text-lg text-neutral-600">
											{table.title}
										</span>
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
				</SidebarMenu>
			</CollapsibleContent>
		</Collapsible>
	);
});

Tables.displayName = 'Tables';

export { Tables };
