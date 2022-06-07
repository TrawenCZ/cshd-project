import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const genres = await prisma.genre.findMany({
            skip: page * 10,
            take: 10,
        })
        return res.send({
            status: "success",
            data: genres,
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
        const genre = await prisma.genre.findUnique({
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
            data: genre,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
