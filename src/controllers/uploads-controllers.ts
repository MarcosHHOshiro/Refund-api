import { Request, Response } from "express"
import z, { ZodError } from "zod"

import uploadConfig from "@/configs/upload"
import { DiskStorage } from "@/providers/disk-storage"
import { AppError } from "@/utils/AppError"

class UploadsController {
    async create(request: Request, response: Response) {
        const diskStorage = new DiskStorage()

        try {
            if (!request.file) {
                throw new AppError("Arquivo obrigatório", 400)
            }

            const fileSchema = z.object({
                filename: z.string().min(1, { message: "Arquivo obrigatório" }),
                mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), {
                    message: "Tipo de arquivo inválido. Formatos permitidos: " + uploadConfig.ACCEPTED_IMAGE_TYPES
                }),
                size: z.number().positive().refine((size) => uploadConfig.MAX_FILE_SIZE >= size, {
                    message: `O tamanho máximo permitido é de 3 MB`
                }),
                path: z.string(),
            })

            const file = fileSchema.parse(request.file)
            const filename = await diskStorage.saveFile(file.filename)

            response.json({ filename })
        } catch (error) {
            if (error instanceof ZodError) {
                if (request.file) {
                    await diskStorage.deleteFile(request.file.filename, "tmp")
                }

                throw new AppError(error.issues[0].message)
            }

            throw error
        }
    }
}

export { UploadsController }