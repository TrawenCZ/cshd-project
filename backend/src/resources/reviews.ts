import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';


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

const reviewSchema = object({
    userId: string().required(),
    gameId: string().required(),
    header: string().required(),
    rating: number().required(),
    description: string().default("")
});

export const store = async (req: Request, res: Response) => {
    try {
        const data = await reviewSchema.validate(req.body);
        if (data.rating > 100 || data.rating < 0) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Rating must be in range 0-100"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: data.userId
            }
        })
        if (!user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "User does not exist"
            });
        }
        const game = await prisma.game.findUnique({
            where: {
                id: data.gameId
            },
            include: {
                _count: {
                    select: {
                        reviews: true
                    }
                }
            }
        })
        if (!game) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Game does not exist"
            });
        }

        const review = await prisma.review.findFirst({
            where: {
                gameId: data.gameId,
                userId: data.userId
            }
        })
        if (review) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Review already exists"
            });
        }

        const newReview = await prisma.review.create({
            data: {
                header: data.header,
                rating: data.rating,
                description: data.description,
                game: {
                    connect: {id: data.gameId}
                },
                user: {
                    connect: {id: data.userId}
                }
            }
        })


        const newRating = Math.round((game._count.reviews * game.rating + data.rating) / (game._count.reviews + 1))
        const updatedGame = await prisma.game.update({
            where: {
                id: data.gameId
            },
            data: {
                rating: newRating
            }
        })

        return res.send({
            status: "success",
            data: newReview,
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
