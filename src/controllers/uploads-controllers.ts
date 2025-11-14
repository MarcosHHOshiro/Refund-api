import { Request, Response } from "express"

class UploadsController {
    async create(request: Request, response: Response) {
        response.json({ file: request.file })
    }
}

export { UploadsController }