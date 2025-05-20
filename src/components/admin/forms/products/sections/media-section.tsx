import { FileDialog } from "@/components/file-dialog";
import { Zoom } from "@/components/image-zoom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormItem, FormLabel, UncontrolledFormMessage } from "@/components/ui/form";
import type { ProductFormValues } from "@/lib/validations/product";
import type { FileWithPreview } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";

interface MediaSectionProps {
	open: boolean;
	onToggle: () => void;
	files: FileWithPreview[];
	setFiles: (files: FileWithPreview[]) => void;
	form: UseFormReturn<ProductFormValues>;
	isUploading: boolean;
	isPending: boolean;
}

export function MediaSection({
	open,
	onToggle,
	files,
	setFiles,
	form,
	isUploading,
	isPending,
}: MediaSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">Media</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<FormItem className="flex w-full flex-col gap-1.5">
					<FormLabel>Images</FormLabel>
					{files.map((file) => (
						<Zoom key={file.name}>
							<Image
								src={file.preview || "/placeholder.svg"}
								alt={file.name}
								className="size-20 shrink-0 rounded-md object-cover object-center"
								width={80}
								height={80}
							/>
						</Zoom>
					))}
					<FormControl>
						<FileDialog
							name="images"
							maxFiles={5}
							maxSize={1024 * 1024 * 4}
							files={files || []}
							setFiles={(newFiles) => setFiles(newFiles as FileWithPreview[])}
							isUploading={isUploading}
							disabled={isPending}
						/>
					</FormControl>
					<UncontrolledFormMessage message={form.formState.errors.images?.message} />
				</FormItem>
			</CollapsibleContent>
		</Collapsible>
	);
}
