import { env } from "@/env"
import { createRouteHandler } from "uploadthing/next"

import { uploadFilesRouter } from "@/app/api/uploadthing/core"

export const { GET, POST } = createRouteHandler({
  router: uploadFilesRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
})
