// import { uploadFilesRouter } from "@/admin/api/uploadthing/core"
import { env } from "@/env.mjs";
import { createRouteHandler } from "uploadthing/next";

// import { uploadFilesRouter } from "@/app/api/uploadthing/core"

import { uploadFilesRouter } from "./core";

export const { GET, POST } = createRouteHandler({
	router: uploadFilesRouter,
	config: {
		token: env.UPLOADTHING_TOKEN,
	},
});
