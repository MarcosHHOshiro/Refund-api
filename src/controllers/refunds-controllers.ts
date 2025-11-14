import { Request, Response } from "express"
import { prisma } from '@/database/prisma'
import { AppError } from "@/utils/AppError"
import z, { file } from "zod"

const CategoriesEnum = z.enum([
    "food",
    "others",
    "services",
    "transport",
    "accomodation"
])

class RefundsController {
    async create(request: Request, response: Response) {
        const bodyschema = z.object({
            name: z.string().trim().min(1, { message: "Informe o nome da solicitação" }),
            category: CategoriesEnum,
            amount: z.number().positive({ message: "O valor precisa ser positivo" }),
            fileName: z.string().min(20)
        })

        const { name, category, amount, fileName } = bodyschema.parse(request.body)

        if (!request.user?.id) {
            throw new AppError("Não autorizado", 401)
        }

        const refund = await prisma.refunds.create({
            data: {
                name,
                category,
                amount,
                fileName,
                userId: request.user?.id
            }
        })

        return response.status(201).json(refund)
    }

    async index(request: Request, response: Response) {
        const querySchema = z.object({
            name: z.string().optional().default(""),
            page: z.coerce.number().optional().default(1),
            perpage: z.coerce.number().optional().default(10)
        })

        const { name, page, perpage } = querySchema.parse(request.query)

        const skip = (page - 1) * perpage

        const refunds = await prisma.refunds.findMany({
            skip,
            take: perpage,
            where: {
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            include: { user: true },
        })

        // obter o total de registros para calcular o numero de paginas
        const totalRecords = await prisma.refunds.count({
            where: {
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            }
        })

        const totalPages = Math.ceil(totalRecords / perpage)

        response.json({
            refunds,
            pagination: {
                page,
                perpage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }
        })
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const refund = await prisma.refunds.findFirst({
            where: { id },
            include: { user: true }
        })

        response.json(refund)
    }
}

export { RefundsController }