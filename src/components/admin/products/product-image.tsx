import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProductImageUpload({
	images = [],
	setImagesAction,
}: {
	images: Array<{ id?: string; url: string; alt?: string }>;
	setImagesAction: (images: Array<{ id?: string; url: string; alt?: string }>) => void;
}) {
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
		setIsUploading(true);

		try {
			// In a real implementation, you would upload files to your server or cloud storage
			// For this example, we'll create object URLs locally
			const newImages = Array.from(files).map((file) => ({
				id: Math.random().toString(36).substring(2, 15),
				url: URL.createObjectURL(file),
				alt: file.name,
			}));

			setImagesAction([...images, ...newImages]);
			toast.success(`${files.length} image${files.length > 1 ? "s" : ""} added successfully`);
		} catch (error) {
			console.error("Error uploading images:", error);
			toast.error("Failed to upload images");
		} finally {
			setIsUploading(false);
		}
	};

	const removeImage = (index: number) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImagesAction(newImages);
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
