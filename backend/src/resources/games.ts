import {Request, Response} from 'express'
import prisma from '../client';
import {array, object, string, ValidationError} from "yup";


const gameGetSchema = object({
    sortBy: string().default("rating"),
    orderType: string().default("desc"),
    platforms: array().default([]),
    gameModes: array().default([]),
});

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)
        const sortData = await gameGetSchema.validate(req.body)

        const games = await prisma.game.findMany({
            orderBy: {
                [sortData.sortBy] : sortData.orderType
            },
            select: {
                id: true,
                name: true,
                rating: true,
                pictures: {
                    where: {
                        isMain: true
                    }
                }
            },
            skip: page * 10,
            take: 10,
        })

        return res.send({
            status: "success",
            data: games,
        })
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).send({
                status: "error",
                data: e.errors,
                message: e.message
            });
        }
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const game = await prisma.game.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                gameModes: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                genres: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                platforms: {
                    select: {
                        id: true,
                        name: true,
                        officialPage: true
                    }
                },
            }
        })

        if (!game) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Game not found"
            });
        }
        return res.send({
            status: "success",
            data: game,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}
