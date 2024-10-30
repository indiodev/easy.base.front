/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Table as Root,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@components/ui/table';
import { User } from '@models/user.model';
import React from 'react';
interface Props {
	data: User[];
	labels: string[];
}

export function Table({ data, labels }: Props): React.ReactElement {
	return (
		<React.Fragment>
			<Root>
				<TableHeader>
					<TableRow className="bg-blue-100/30 hover:bg-blue-100/30">
						{labels.map((label) => (
							<TableHead key={label}>
								<span>{label}</span>
							</TableHead>
						))}
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row._id}>
							<TableCell className="font-medium">{row.name}</TableCell>
							<TableCell className="font-medium">{row.email}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Root>
		</React.Fragment>
	);
}
