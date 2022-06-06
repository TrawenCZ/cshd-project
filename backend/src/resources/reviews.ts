import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

const gameFilterSchema = object({
    user: string().optional(),
    game: string().optional()
});

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)
        const { user, game } = req.body
        let reviews

        if (user) {
            reviews = await prisma.review.findMany({
                where: {
                    userId: user
                },
                skip: page * 10,
                take: 10
            })
        } else {
            reviews = await prisma.review.findMany({
                where: {
                    gameId: game
                },
                skip: page * 10,
                take: 10
            })
        }

        return res.send({
            status: "success",
            data: reviews,
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
        const review = await prisma.review.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        })
        return res.send({
            status: "success",
            data: review,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}

