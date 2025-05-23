import { auth } from "@/auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const uploadFilesRouter = {
	productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
		.middleware(async (_req) => {
			const session = await auth();

			// if (!session) throw new Error("Unauthorized")
			if (!session) throw new UploadThingError("Unauthorized");

			return { userId: session.user.id };
		})

		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.ufsUrl);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type UploadFilesRouter = typeof uploadFilesRouter;
