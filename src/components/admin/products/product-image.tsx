import type { UploadFilesRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateReactHelpers } from "@uploadthing/react";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

const { useUploadThing } = generateReactHelpers<UploadFilesRouter>();

export function ProductImageUpload({
	images = [],
	setImages,
}: {
	images: Array<{ id?: string; url: string; alt?: string; position: number }>;
	setImages: (newImages: Array<{ id?: string; url: string; alt?: string; position: number }>) => void;
}) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { isUploading, startUpload } = useUploadThing("productImage", {
		onClientUploadComplete: () => {
			toast.success("Image uploaded successfully");
		},
		onUploadError: () => {
			toast.error("Failed to upload image");
		},
		onUploadBegin: () => {
			toast.info("Uploading image");
		},
	});

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFiles(e.target.files);
		}
	};

	const handleFiles = async (files: FileList) => {
		try {
			const newImages = await startUpload(Array.from(files));

			if (!newImages) {
				throw new Error("Failed to upload images");
			}

			setImages([
				...images,
				...newImages.map((image) => ({
					id: image.key,
					url: image.ufsUrl,
					alt: image.key.split("_")[1] ?? image.key,
					position: images.length + 1,
				})),
			]);

			toast.success(`${files.length} image${files.length > 1 ? "s" : ""} added successfully`);
		} catch (error) {
			console.error("Error uploading images:", error);
			toast.error("Failed to upload images");
		}
	};

	const removeImage = async (index: number) => {
		// Create a copy of the current images array
		const newImages = [...images];

		// Store the removed image info for the toast message
		const removedImage = newImages[index];

		// Remove the image at the specified index
		newImages.splice(index, 1);

		// Update positions for remaining images to ensure they're sequential
		const updatedImages = newImages.map((img, idx) => ({
			...img,
			position: idx + 1,
		}));

		// Update the state with the new array
		setImages(updatedImages);

		// Show success toast
		toast.success(`${removedImage?.alt} removed successfully`);
	};

	return (
		<div className="space-y-4">
			<div
				className={cn(
					"border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
					isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<div className="flex flex-col items-center justify-center gap-2">
					<div className="p-3 rounded-full bg-primary/10">
						<Plus className="w-6 h-6 text-primary" />
					</div>
					<h3 className="text-lg font-medium">Add images</h3>
					<p className="text-sm text-muted-foreground">Drag and drop images or click to browse</p>
					<p className="text-xs text-muted-foreground mt-2">Accepts JPG, PNG and GIF files up to 5MB</p>
					{isUploading && <p className="text-sm text-primary mt-2">Uploading...</p>}
				</div>
				<input
					type="file"
					ref={fileInputRef}
					disabled={isUploading}
					multiple
					accept="image/*"
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			{images.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
					{images.map((image, index) => (
						<div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
							<Image src={image.url} alt={image.alt || "Product image"} fill className="object-cover" />
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<Button
									type="button"
									variant="destructive"
									size="sm"
									className="opacity-90"
									onClick={(e) => {
										e.stopPropagation();
										removeImage(index);
									}}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
