import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from '@components/ui/extension/file-upload';
import { FormField, FormItem, FormLabel } from '@components/ui/form';
import { Column } from '@models/column.model';
import { CloudUploadIcon, PaperclipIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function FileField({
	column,
	defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: unknown;
}) {
	const form = useFormContext();
	console.info({ defaultValue });

	return (
		<FormField
			control={form.control}
			name={String(column?.slug)}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{column?.title}</FormLabel>
					<FileUploader
						value={field.value}
						onValueChange={field.onChange}
						dropzoneOptions={{
							multiple: true,
							maxFiles: 10,
							maxSize: 4 * 1024 * 1024,
						}}
						reSelect={true}
						className="relative bg-background rounded-lg p-2 border border-dashed border-gray-500"
					>
						<FileInput className="outline-dashed outline-1 outline-white ">
							<div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
								<CloudUploadIcon className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
								<p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
									<span>
										<strong>Clique para fazer upload</strong> ou arraste e
										solte.
									</span>
								</p>
								{/* <p className="text-xs text-gray-500 dark:text-gray-400">
                Arquivo de PDF ou de imagem (jpg ou png)
              </p> */}
							</div>
						</FileInput>
						{field.value && field.value.length > 0 && (
							<FileUploaderContent>
								{(field.value as File[]).map((file, index) => (
									<FileUploaderItem
										key={index}
										index={index}
									>
										<PaperclipIcon className="h-4 w-4 stroke-current" />
										<span>{file.name}</span>
									</FileUploaderItem>
								))}
							</FileUploaderContent>
						)}
					</FileUploader>
				</FormItem>
			)}
		/>
	);
}
