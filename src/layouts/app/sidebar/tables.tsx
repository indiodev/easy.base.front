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
import { useTable } from '@hooks/use-table';
import { cn } from '@libs/utils';
import { INITIAL_QUERY_STATE, QueryStore } from '@store/query.store';
import { ChevronDown, Database, Plus, Table } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tables = React.forwardRef<
	React.ElementRef<typeof SidebarMenuButton>,
	React.ComponentPropsWithoutRef<typeof SidebarMenuButton>
>(({ className, ...props }, ref) => {
	const navigate = useNavigate();
	const { merge } = QueryStore();

	const { tables } = useTable();

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
					<Database className="h-5 w-5 text-foreground" />
					<span className="pl-1 text-lg text-foreground font-normal">
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
							<Plus className="h-5 w-5 text-foreground" />
							<span className="text-lg text-foreground">Nova tabela</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{tables.map((table) => (
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
										navigate(
											{
												pathname: `/app/tables/${table._id}`,
												search: 'page=1&per_page=10&filter=inactive',
											},
											{
												state: {
													table: table,
												},
												replace: true,
											},
										);

										merge(INITIAL_QUERY_STATE);
									}}
									className="font-normal"
								>
									<Table className="h-5 w-5 text-foreground" />
									<span className="text-lg text-foreground">{table.title}</span>
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
