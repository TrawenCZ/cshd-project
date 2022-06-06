import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const games = await prisma.game.findMany({
            skip: page * 10,
            take: 10,
        })

        return res.send({
            status: "success",
            data: games,
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
