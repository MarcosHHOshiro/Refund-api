import { Request, Response } from "express"
import z from "zod"

import uploadConfig from "@/configs/upload"

class UploadsController {
    async create(request: Request, response: Response) {
        try {
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

            const { file } = fileSchema.parse(request.file)

        } catch (error) {
            throw error
        }
    }
}

export { UploadsController }