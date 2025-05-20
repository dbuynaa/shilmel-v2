// // components/products/image-uploader.tsx
// "use client";

// i;
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DragDropContext, Draggable, type DropResult, Droppable } from "@hello-pangea/dnd";
// import { generateReactHelpers } from "@uploadthing/react";
// import { Grip, Upload, X } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import { toast } from "sonner";

// const { useUploadThing } = generateReactHelpers<OurFileRouter>();

// export type ImageInfo = {
// 	url: string;
// 	alt?: string;
// 	position: number;
// };

// interface ImageUploaderProps {
// 	images: ImageInfo[];
// 	onChangeAction: (images: ImageInfo[]) => void;
// }

// export function ImageUploader({ images, onChangeAction }: ImageUploaderProps) {
// 	const { startUpload, isUploading } = useUploadThing("imageUploader", {
// 		onClientUploadComplete: (res) => {
// 			toast.success("Upload complete", {
// 				description: res.map((file) => (
// 					<a
// 						key={file.ufsUrl}
// 						href={file.ufsUrl}
// 						target="_blank"
// 						rel="noopener noreferrer"
// 						className="text-blue-500 hover:underline"
// 					>
// 						{file.name}
// 					</a>
// 				)),
// 				duration: 5000,
// 			});
// 		},
// 		onUploadError: (error) => {
// 			console.error("Error uploading:", error);
// 			toast.error("Error uploading images. Please try again.");
// 		},
// 	});

// 	const { getRootProps, getInputProps } = useDropzone({
// 		accept: {
// 			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
// 		},
// 		onDrop: (acceptedFiles) => {
// 			void handleUpload(acceptedFiles);
// 		},
// 	});

// 	const handleUpload = async (files: File[]) => {
// 		const uploadedFiles = await startUpload(files);
// 		if (!uploadedFiles) {
// 			throw new Error("Upload failed");
// 		}

// 		const uploadedImages = uploadedFiles.map((file, index) => ({
// 			url: file.ufsUrl,
// 			alt: file.name,
// 			position: images.length + index,
// 		}));

// 		console.log("Uploaded images:", uploadedImages);
// 	};

// 	const handleRemoveImage = async (index: number) => {
// 		const updatedImages = [...images];
// 		updatedImages.splice(index, 1);

// 		// Update positions
// 		const reindexedImages = updatedImages.map((img, idx) => ({
// 			...img,
// 			position: idx,
// 		}));

// 		// await onChangeAction(reindexedImages);
// 	};

// 	const handleUpdateAlt = async (index: number, alt: string) => {
// 		const updatedImages = [...images];
// 		const currentImage = updatedImages[index];
// 		updatedImages[index] = {
// 			url: currentImage?.url || "",
// 			position: currentImage?.position || 0,
// 			alt,
// 		};
// 		await onChangeAction(updatedImages);
// 	};

// 	const handleDragEnd = async (result: DropResult) => {
// 		if (!result.destination) return;

// 		const items = Array.from(images);
// 		const [reorderedItem] = items.splice(result.source.index, 1) as [(typeof items)[0]];
// 		items.splice(result.destination.index, 0, reorderedItem);

// 		// Update positions
// 		const reindexedItems = items.map((item, index) => ({
// 			...item,
// 			position: index,
// 		}));

// 		await onChangeAction(reindexedItems);
// 	};

// 	return (
// 		<div className="space-y-4">
// 			<div
// 				{...getRootProps()}
// 				className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
// 			>
// 				<input {...getInputProps()} />
// 				<div className="flex flex-col items-center justify-center gap-2">
// 					<Upload className="h-8 w-8 text-muted-foreground" />
// 					<p className="text-lg font-medium">Drag & drop images here</p>
// 					<p className="text-sm text-muted-foreground">or click to browse files (JPG, PNG, GIF up to 5MB)</p>
// 					{isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
// 				</div>
// 			</div>

// 			{images.length > 0 && (
// 				<DragDropContext onDragEnd={handleDragEnd}>
// 					<Droppable droppableId="product-images">
// 						{(provided) => (
// 							<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
// 								{images
// 									.sort((a, b) => a.position - b.position)
// 									.map((image, index) => (
// 										<Draggable
// 											key={`${image.url}-${index}`}
// 											draggableId={`${image.url}-${index}`}
// 											index={index}
// 										>
// 											{(provided) => (
// 												<div
// 													ref={provided.innerRef}
// 													{...provided.draggableProps}
// 													className="flex items-center gap-4 border rounded-lg p-3 bg-background"
// 												>
// 													<div {...provided.dragHandleProps} className="cursor-grab">
// 														<Grip className="h-5 w-5 text-muted-foreground" />
// 													</div>
// 													<div className="h-16 w-16 overflow-hidden rounded-md shrink-0">
// 														<img
// 															src={image.url}
// 															alt={image.alt || ""}
// 															className="h-full w-full object-cover"
// 														/>
// 													</div>
// 													<div className="flex-1">
// 														<Input
// 															placeholder="Image description"
// 															value={image.alt || ""}
// 															onChange={(e) => handleUpdateAlt(index, e.target.value)}
// 															className="text-sm"
// 														/>
// 													</div>
// 													<Button
// 														type="button"
// 														variant="ghost"
// 														size="icon"
// 														onClick={() => handleRemoveImage(index)}
// 													>
// 														<X className="h-5 w-5" />
// 														<span className="sr-only">Remove</span>
// 													</Button>
// 												</div>
// 											)}
// 										</Draggable>
// 									))}
// 								{provided.placeholder}
// 							</div>
// 						)}
// 					</Droppable>
// 				</DragDropContext>
// 			)}
// 		</div>
// 	);
// }
