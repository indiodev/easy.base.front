import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { useRowShowQuery } from '@query/row/show';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function View(): React.ReactElement {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	const { data: row, status: row_status } = useRowShowQuery({
		id: params.id!,
		tableId: params.tableId!,
	});

	return (
		<section className="bg-slate-50 flex-1 flex-col space-y-4 p-6">
			<div className="inline-flex">
				<Button
					className="bg-transparent shadow-none text-black hover:bg-transparent"
					onClick={() => {
						navigate(
							-1,
							// location.pathname
							// 	.replace(`/${params.id!}`, '')
							// 	.replace('/view', ''),
						);
					}}
				>
					<ArrowLeft />
				</Button>
				<h2 className="font-semibold text-2xl">
					Detalhes do registro (id: {params.id})
				</h2>
			</div>

			{row_status === 'pending' && (
				<Loading className="flex justify-center items-center h-screen flex-1" />
			)}

			{row_status === 'success' && (
				<React.Fragment>
					{Object.entries(row).map(([row_key, row_value]) => {
						if (row_key === 'value') {
							const values = Object.entries(row_value);
							return (
								<div className="grid grid-cols-2 gap-4">
									{values.map(([k, v]) => (
										<div
											key={k}
											className="flex flex-col flex-1 bg-indigo-400 p-3 rounded-lg"
										>
											<span className="font-semibold text-white uppercase">
												{k}:
											</span>
											<span className="text-white">{v as React.ReactNode}</span>
										</div>
									))}
								</div>
							);
						}

						return <React.Fragment></React.Fragment>;
					})}
				</React.Fragment>
			)}
		</section>
	);
}
