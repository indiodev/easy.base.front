import { Button } from '@components/ui/button';
import { Item, Tree } from '@components/ui/extension/tree-view/api';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { ChevronRightIcon, PlusIcon } from 'lucide-react';
import React from 'react';

interface Tree {
	value: string;
	label: string;
	children?: Tree[];
}

function TreeItemField({
	node,
	parent,
	onAddChild,
}: {
	node: Tree;
	parent: string[];
	onAddChild: (props: { path: string[]; child: Tree }) => void;
}) {
	const [newVisible, setNewVisible] = React.useState(
		node?.children?.length === 0,
	);
	const path = [...parent, node.value];
	const identifier = path?.join('-')?.toLocaleLowerCase();

	console.log(identifier, node?.children, node?.children?.length === 0);
	return (
		<Item
			key={identifier}
			element={node.label}
			value={identifier}
		>
			{node?.children?.map((c: Tree) => (
				<TreeItemField
					key={c.value}
					node={c}
					parent={path}
					onAddChild={onAddChild}
				/>
			))}
			<div className="w-full inline-flex items-center">
				{!newVisible && <ChevronRightIcon className="h-4 w-4" />}
				{newVisible && (
					<div className="w-full inline-flex items-center">
						<Button
							type="button"
							className="p-0 hover:bg-transparent hover:text-blue-500 font-normal"
							variant="ghost"
							onClick={() => setNewVisible((state) => !state)}
						>
							<PlusIcon className="h-4 w-4" />
							<span>Adicionar Nó</span>
						</Button>
					</div>
				)}
				{!newVisible && (
					<Input
						placeholder={`Adicionar sub-nó em ${node.label}`}
						onKeyUp={(e) => {
							const VALID_VALUE = (e.currentTarget.value || '').trim() !== '';
							const VALID_KEY = e.key === 'Enter' && e.code === 'Enter';
							if (VALID_VALUE && VALID_KEY) {
								onAddChild({
									child: {
										value: e.currentTarget.value,
										label: e.currentTarget.value,
										children: [],
									},
									path,
								});
								e.currentTarget.value = '';
								setNewVisible((state) => !state);
							}
						}}
						className="py-0 px-1 border-transparent bg-transparent focus-visible:right-0 focus-visible:ring-transparent"
					/>
				)}
			</div>
		</Item>
	);
}

export function TreeField() {
	const [tree, setTree] = React.useState<Tree[]>([]);
	const [newVisible, setNewVisible] = React.useState(tree?.length === 0);

	function addChild({ child, path }: { path: string[]; child: Tree }) {
		setTree((prev) => {
			const payload = [...prev];

			let currentLevel = payload;

			for (const key of path) {
				const node = currentLevel.find((n) => n.value === key);
				if (!node) return prev; // Caminho inválido
				if (!node.children) node.children = [];
				currentLevel = node.children;
			}

			currentLevel.push(child);
			return payload;
		});
	}

	return (
		<div className="flex flex-col space-y-2">
			<Label>Configuração da árvore</Label>
			<Tree className="h-auto bg-slate-200/50 p-2">
				{tree?.map((child) => (
					<TreeItemField
						key={child.value}
						node={child}
						parent={[]}
						onAddChild={addChild}
					/>
				))}
				<div className="w-full inline-flex items-center">
					{newVisible && <ChevronRightIcon className="h-4 w-4" />}
					{!newVisible && (
						<div className="w-full inline-flex items-center">
							<Button
								type="button"
								className="p-0 hover:bg-transparent hover:text-blue-500 font-normal"
								variant="ghost"
								onClick={() => setNewVisible((state) => !state)}
							>
								<PlusIcon className="h-4 w-4" />
								<span>Adicionar Nó</span>
							</Button>
						</div>
					)}
					{newVisible && (
						<Input
							autoFocus
							placeholder="Nome do Nó"
							onKeyUp={(e) => {
								const VALID_VALUE = (e.currentTarget.value || '').trim() !== '';
								const VALID_KEY = e.key === 'Enter' && e.code === 'Enter';

								if (VALID_VALUE && VALID_KEY) {
									setTree((state) => [
										...state,
										{
											value: e.currentTarget.value,
											label: e.currentTarget.value,
											children: [],
										},
									]);

									e.currentTarget.value = '';
									setNewVisible((state) => !state);
								}
							}}
							className="py-0 px-1 border-transparent bg-transparent focus-visible:right-0 focus-visible:ring-transparent"
						/>
					)}
				</div>
			</Tree>
		</div>
	);
}
