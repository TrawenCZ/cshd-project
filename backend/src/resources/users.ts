import { Request, Response } from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const users = await prisma.user.findMany({
            skip: page * 10,
            take: 10,
        })
        return res.send({
            status: "success",
            data: users,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
