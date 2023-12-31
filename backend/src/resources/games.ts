import {Request, Response} from 'express';
import prisma from '../client';
import {array, object, string, ValidationError} from "yup";
import {platforms} from "./index";


const gameGetSchema = object({
    sortBy: string().default("rating"),
    orderType: string().default("desc"),
    platforms: array().default(undefined),
    gameModes: array().default(undefined),
    genres: array().default(undefined),
    developers: array().default(undefined),
    releaseRange: array().default([1980, new Date().getFullYear()]),
    ratingRange: array().default([0, 100]),
});

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)
        const itemsPerPage = +(req.query.itemsPerPage || 10)
        const sortData = await gameGetSchema.validate(req.body)

        const games = await prisma.game.findMany({
            where: {
                rating: {
                  gte: sortData.ratingRange[0],
                  lte: sortData.ratingRange[1],
                },
                releaseDate: {
                    gte: new Date(`${sortData.releaseRange[0]}-01-01"`),
                    lte: new Date(`${sortData.releaseRange[1]}-12-31"`)
                },
                platforms:  {
                    some: {
                        id: {
                            in: sortData.platforms
                        }
                    }
                },
                gameModes: {
                    some: {
                        id: {
                            in: sortData.gameModes
                        }
                    }
                },
                genres: {
                    some: {
                        id: {
                            in: sortData.genres
                        }
                    }
                },
                developerId: {
                    in: sortData.developers
                }
            },
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
            skip: page * itemsPerPage,
            take: itemsPerPage,
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
                pictures: {
                    orderBy: {
                        isMain: "desc"
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        header: true,
                        rating: true,
                        description: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true
                            }
                        }
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
