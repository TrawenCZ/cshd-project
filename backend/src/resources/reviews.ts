import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';


export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)
        const { user, game } = req.body
        let reviews

        if (user && game) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Request body must contain only userID or only gameID"
            });
        } else if (user) {
            reviews = await prisma.review.findMany({
                where: {
                    userId: user
                },
                skip: page * 10,
                take: 10
            })
        } else if (game) {
            reviews = await prisma.review.findMany({
                where: {
                    gameId: game
                },
                skip: page * 10,
                take: 10
            })
        } else {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "There must be a request body containing userID or gameID"
            });
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

const newReviewSchema = object({
    userId: string().required(),
    gameId: string().required(),
    header: string().required(),
    rating: number().required(),
    description: string().default("")
});

export const store = async (req: Request, res: Response) => {
    try {
        const data = await newReviewSchema.validate(req.body);
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

const removeReviewSchema = object({
    userId: string().required()
});

export const remove = async (req: Request, res: Response) => {
    try {
        const data = await removeReviewSchema.validate(req.body)
        const senderId = req.header('X-User')!
        const user = await prisma.user.findUnique({
            where: {
                id: data.userId
            }
        })

        if (data.userId !== senderId) {
            return res.status(403).send({
                status: "error",
                data: {},
                message: "Not authorized to delete given message"
            });
        }

        if (user && !user.isAdmin) {
            return res.status(403).send({
                status: "error",
                data: {},
                message: "User is not an admin!"
            });
        } else if (!user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "User does not exist"
            });
        }

        const review = await prisma.review.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!review) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Review does not exist"
            });
        }

        const game = await prisma.game.findUnique({
            where: {
                id: review.gameId
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
            return res.status(500).send({
                status: "error",
                data: {},
                message: "Game was not found"
            });
        }

        const newRating = Math.round((game._count.reviews * game.rating - review.rating) / (game._count.reviews - 1))
        const updatedGame = await prisma.game.update({
            where: {
                id: review.gameId
            },
            data: {
                rating: newRating
            }
        })

        const deletedReview = await prisma.review.delete({
            where: {
                id: req.params.id
            }
        })
        return res.send({
            status: "success",
            data: deletedReview,
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

const updateReviewSchema = object({
    userId: string().required(),
    header: string().optional(),
    rating: number().optional(),
    description: string().optional()
});

export const update = async (req: Request, res: Response) => {
    try {
        const data = await updateReviewSchema.validate(req.body)
        const senderId = req.header('X-User')!
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

        const review = await prisma.review.findUnique({
            where: {
                id: req.params.id
            }
        })

        if (!review) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Review does not exist"
            });
        }

        if (data.rating) {
            if (data.rating > 100 || data.rating < 0) {
                return res.status(400).send({
                    status: "error",
                    data: {},
                    message: "Rating must be in range 0-100"
                });
            }
            const game = await prisma.game.findUnique({
                where: {
                    id: review.gameId
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
                return res.status(500).send({
                    status: "error",
                    data: {},
                    message: "Game was not found"
                });
            }
            const newRating = Math.round((game._count.reviews * game.rating - review.rating + data.rating) / (game._count.reviews))
            const updatedGame = await prisma.game.update({
                where: {
                    id: review.gameId
                },
                data: {
                    rating: newRating
                }
            })
        }

        if (data.userId !== senderId) {
            return res.status(403).send({
                status: "error",
                data: {},
                message: "Not authorized to delete given message"
            });
        }

        const updatedReview = await prisma.review.update({
            where: {
                id: req.params.id
            },
            data: {
                ...data
            }
        })
        return res.send({
            status: "success",
            data: updatedReview,
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
