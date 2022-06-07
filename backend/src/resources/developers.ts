import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const developers = await prisma.developer.findMany({
            skip: page * 10,
            take: 10,
        })
        return res.send({
            status: "success",
            data: developers,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const developer = await prisma.developer.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                games: {
                    select: {
                        id: true,
                        name: true,
                        pictures: {
                            where: {
                                isMain: true
                            }
                        }
                    }
                }
            }
        })
        return res.send({
            status: "success",
            data: developer,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
