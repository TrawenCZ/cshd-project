import * as games from "./games"
import * as gameModes from "./gameModes"
import * as users from "./users"
import * as genres from "./genres"
import * as developers from "./developers"
import * as platforms from "./platforms"
import * as reviews from "./reviews"
import {object, string, ValidationError} from "yup";
import {Request, Response} from "express";
import prisma from "../client";

const searchSchema = object({
    value: string().required()
});

export const search = async (req: Request, res: Response) => {
    try {
        const data = await searchSchema.validate(req.body)
        const page = +(req.query.page || 0)

        const games = await prisma.game.findMany({
            where: {
                OR : [
                    { name: { contains: data.value } },
                    { description: { contains: data.value } },
                    { platforms: { some: { name: { contains: data.value } } } },
                    { genres: { some: { name: { contains: data.value } } } }
                ],
            },
            select: {
                id: true,
                name: true,
                pictures: {
                    where: {
                        isMain: true
                    }
                }
            },
            orderBy: {
                rating: "desc"
            },
            skip: page * 10,
            take: 10
        })
        const users = await prisma.user.findMany({
            where: {
                OR : [{
                    username: {
                        contains: data.value
                    }
                },
                    {
                        aboutMe: {
                            contains: data.value
                        }
                    }],
            },
            select: {
                id: true,
                username: true,
                profilePicture: true
            },
            orderBy: {
                username: "asc"
            },
            skip: page * 5,
            take: 5
        })
        const output = {
            games: games,
            users: users
        }
        return res.send({
            status: "success",
            data: output
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

export {
    games,
    gameModes,
    genres,
    developers,
    platforms,
    reviews,
    users
}
