import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const genres = await prisma.genre.findMany({
            orderBy: {
                name: "asc"
            }
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
        if (!genre) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Genre not found"
            });
        }
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
