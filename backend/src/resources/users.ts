import { Request, Response } from 'express'
import prisma from '../client';
import {object, string, ValidationError} from "yup";
import sha256 from "fast-sha256";

export const list = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || 0)

        const users = await prisma.user.findMany({
            skip: page * 10,
            take: 10,
        })
        return res.send({
            status: "success",
            data: users,
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
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                reviews: {
                    select: {
                        id: true,
                        header: true,
                        rating: true,
                        game: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return res.send({
            status: "success",
            data: user,
        })
    } catch (e) {
        return res.status(500).send({
            status: "error",
            data: {},
            message: "Something went wrong"
        });
    }
}

const userSchema = object({
    username: string().required(),
    password: string().required(),
    aboutMe: string().default(""),
    profilePicture: string().optional()
});

export const store = async (req: Request, res: Response) => {
    try {
        const data = await userSchema.validate(req.body);
        const password = sha256(Buffer.from(data.password)).toString();

        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })
        if (user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Username already taken"
            })
        }

        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: password
            },
            select: {
                id: true
            }
        })
        return res.send({
            status: "success",
            data: newUser,
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

const loginSchema = object({
    username: string().required(),
    password: string().required()
});

export const login = async (req: Request, res: Response) => {
    try {
        const data = await loginSchema.validate(req.body)

        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            },
            select : {
                id: true,
                password: true
            }
        })

        if (!user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Invalid username"
            });
        }

        const givenPasswordHash = sha256(Buffer.from(data.password)).toString();
        if (givenPasswordHash !== user.password) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "Invalid password"
            });
        }
        return res.send({
            status: "success",
            data: {
                id: user.id
            },
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
