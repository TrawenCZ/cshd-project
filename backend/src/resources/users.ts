import { Request, Response } from 'express'
import prisma from '../client';
import {number, object, string, ValidationError} from "yup";

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

const userSchema = object({
    username: string().required(),
    password: string().required(),
    aboutMe: string().default(""),
});

export const store = async (req: Request, res: Response) => {
    try {
        const data = await userSchema.validate(req.body);
        const password = stringHash(data.password);

        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })
        if (user) {
            res.status(400).send({
                status: "error",
                data: {},
                message: "Username already taken"
            })
        }

        const newUser = await prisma.user.create({
            data: {
                ...data
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
