import { Request, Response } from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();

        return res.send({
            status: "success",
            data: users
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
