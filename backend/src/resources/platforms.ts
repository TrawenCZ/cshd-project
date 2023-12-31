import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const platforms = await prisma.platform.findMany({
            orderBy: {
                name: "asc"
            }
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
                        description: true,
                        rating:true,
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
