// import "cropperjs/dist/cropper.css"

import type { FileWithPreview } from "@/types";
import Image from "next/image";
import * as React from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import { type Accept, type FileRejection, type FileWithPath, useDropzone } from "react-dropzone";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/lib/hooks/use-toast";
import { cn, formatBytes } from "@/lib/utils";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface FileDialogProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
	name: TName;
	// setValue: UseFormSetValue<TFieldValues>;
	accept?: Accept;
	maxSize?: number;
	maxFiles?: number;
	files: FileWithPreview[] | null;
	setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
	isUploading?: boolean;
	disabled?: boolean;
}

export function FileDialog<TFieldValues extends FieldValues>({
	name,
	// setValue,
	accept = {
		"image/*": [],
	},
	maxSize = 1024 * 1024 * 2,
	maxFiles = 3,
	files,
	setFiles,
	isUploading = false,
	disabled = false,
	className,
	...props
}: FileDialogProps<TFieldValues>) {
	const { toast } = useToast();

	const onDrop = React.useCallback(
		(acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
			acceptedFiles.forEach((file) => {
				const fileWithPreview = Object.assign(file, {
					preview: URL.createObjectURL(file),
				});
				setFiles([...(files ?? []), fileWithPreview]);
			});

			if (rejectedFiles.length > 0) {
				rejectedFiles.forEach(({ errors }) => {
					if (errors[0]?.code === "file-too-large") {
						toast({
							title: "File is too large",
							description: `File is too large. Max size is ${formatBytes(maxSize)}`,
							variant: "destructive",
						});
						return;
					}
					errors[0]?.message &&
						toast({
							title: "Something went wrong",
							description: String(errors[0].message),
							variant: "destructive",
						});
				});
			}
		},

		[maxSize, setFiles, toast],
	);

	// React.useEffect(() => {
	// 	setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [files]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept,
		maxSize,
		maxFiles,
		multiple: maxFiles > 1,
		disabled,
	});

	React.useEffect(() => {
		return () => {
			if (!files) return;
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" disabled={disabled}>
					Upload Images
					<span className="sr-only">Upload Images</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[480px]">
				<DialogTitle className="text-muted-foreground absolute top-4 left-5 text-base font-medium">
					Upload Images
				</DialogTitle>
				<div
					{...getRootProps()}
					className={cn(
						"group border-muted-foreground/25 hover:bg-muted/25 relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
						"ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
						isDragActive && "border-muted-foreground/50",
						disabled && "pointer-events-none opacity-60",
						className,
					)}
					{...props}
				>
					<input type="file" {...getInputProps()} />
					{isUploading ? (
						<div className="group grid w-full place-items-center gap-1 sm:px-10">
							<Icons.upload className="text-muted-foreground size-9 animate-pulse" aria-hidden="true" />
						</div>
					) : isDragActive ? (
						<div className="text-muted-foreground grid place-items-center gap-2 sm:px-5">
							<Icons.upload className={cn("size-8", isDragActive && "animate-bounce")} aria-hidden="true" />
							<p className="text-base font-medium">Drop the file here</p>
						</div>
					) : (
						<div className="grid place-items-center gap-1 sm:px-5">
							<Icons.upload className="text-muted-foreground size-8" aria-hidden="true" />
							<p className="text-muted-foreground mt-2 text-base font-medium">
								Drag {`'n'`} drop file here, or click to select file
							</p>
							<p className="text-sm text-slate-500">
								Please upload file with size less than {formatBytes(maxSize)}
							</p>
						</div>
					)}
				</div>
				<p className="text-muted-foreground text-center text-sm font-medium">
					You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
				</p>
				{files?.length ? (
					<div className="grid gap-5">
						{files?.map((file, i) => (
							<FileCard key={i} i={i} files={files} setFiles={setFiles} file={file} />
						))}
					</div>
				) : null}
				{files?.length ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2.5 w-full"
						onClick={() => setFiles(null)}
					>
						<Icons.trash className="mr-2 size-4" aria-hidden="true" />
						Remove All
						<span className="sr-only">Remove all</span>
					</Button>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

interface FileCardProps {
	i: number;
	file: FileWithPreview;
	files: FileWithPreview[] | null;
	setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
}

function FileCard({ i, file, files, setFiles }: FileCardProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [cropData, setCropData] = React.useState<string | null>(null);
	const cropperRef = React.useRef<ReactCropperElement>(null);

	const onCrop = React.useCallback(() => {
		if (!files || !cropperRef.current) return;

		const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
		setCropData(croppedCanvas.toDataURL());

		croppedCanvas.toBlob((blob) => {
			if (!blob) {
				console.error("Blob creation failed");
				return;
			}
			const croppedImage = new File([blob], file.name, {
				type: file.type,
				lastModified: Date.now(),
			});

			const croppedFileWithPathAndPreview = Object.assign(croppedImage, {
				preview: URL.createObjectURL(croppedImage),
				path: file.name,
			}) satisfies FileWithPreview;

			const newFiles = files.map((file, j) => (j === i ? croppedFileWithPathAndPreview : file));
			setFiles(newFiles);
		});
	}, [file.name, file.type, files, i, setFiles]);

	React.useEffect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === "Enter") {
				onCrop();
				setIsOpen(false);
			}
		}
		document.addEventListener("keydown", handleKeydown);
		return () => document.removeEventListener("keydown", handleKeydown);
	}, [onCrop]);

	return (
		<div className="relative flex items-center justify-between gap-2.5">
			<div className="flex items-center gap-2">
				<Image
					src={cropData ? cropData : file.preview}
					alt={file.name}
					className="size-10 shrink-0 rounded-md"
					width={40}
					height={40}
					loading="lazy"
				/>
				<div className="flex flex-col">
					<p className="text-muted-foreground line-clamp-1 text-sm font-medium">{file.name}</p>
					<p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{file.type.startsWith("image") && (
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline" size="icon" className="size-7">
								<Icons.cropImage className="size-4 text-white" aria-hidden="true" />
								<span className="sr-only">Crop image</span>
							</Button>
						</DialogTrigger>
						<DialogContent>
							<p className="text-muted-foreground absolute top-4 left-5 text-base font-medium">Crop image</p>
							<div className="mt-8 grid place-items-center space-y-5">
								<Cropper
									ref={cropperRef}
									className="size-[450px] object-cover"
									zoomTo={0.5}
									initialAspectRatio={1 / 1}
									preview=".img-preview"
									src={file.preview}
									viewMode={1}
									minCropBoxHeight={10}
									minCropBoxWidth={10}
									background={false}
									responsive={true}
									autoCropArea={1}
									checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
									guides={true}
								/>
								<div className="flex items-center justify-center space-x-2">
									<Button
										aria-label="Crop image"
										type="button"
										size="sm"
										className="h-8"
										onClick={() => {
											onCrop();
											setIsOpen(false);
										}}
									>
										<Icons.cropImage className="mr-2 size-3.5" aria-hidden="true" />
										Crop image
									</Button>
									<Button
										aria-label="Reset crop"
										type="button"
										variant="outline"
										size="sm"
										className="h-8"
										onClick={() => {
											cropperRef.current?.cropper.reset();
											setCropData(null);
										}}
									>
										<Icons.reset className="mr-2 size-3.5" aria-hidden="true" />
										Reset crop
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				)}
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-7"
					onClick={() => {
						if (!files) return;
						setFiles(files.filter((_, j) => j !== i));
					}}
				>
					<Icons.close className="size-4 text-white" aria-hidden="true" />
					<span className="sr-only">Remove file</span>
				</Button>
			</div>
		</div>
	);
}
