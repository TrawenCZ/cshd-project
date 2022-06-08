import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const platforms = await prisma.platform.findMany({
            skip: page * 10,
            take: 10,
        })
        return res.send({
            status: "success",
            data: platforms,
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
        const platform = await prisma.platform.findUnique({
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
        if (!platform) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Platform not found"
            });
        }
        return res.send({
            status: "success",
            data: platform,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
