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
            select: {
                id: true,
                username: true,
                aboutMe: true,
                isAdmin: true,
                profilePicture: true,
                reviews: {
                    select: {
                        id: true,
                        header: true,
                        rating: true,
                        description: true,
                        game: {
                            select: {
                                name: true,
                                pictures: {
                                    where: {
                                        isMain: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        if (!user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "User not found"
            });
        }
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
    passwordRepeat: string().required(),
    aboutMe: string().default(""),
    profilePicture: string().default("https://www.rockandpop.eu/wp-content/plugins/buddyboss-platform/bp-core/images/profile-avatar-buddyboss.png")
});

export const store = async (req: Request, res: Response) => {
    try {
        const data = await userSchema.validate(req.body);

        if (data.password !== data.passwordRepeat) {
            return res.status(204).send({
                status: "error",
                data: {},
                message: "Passwords are not the same"
            })
        }

        data.password = new TextDecoder().decode(sha256(Buffer.from(data.password)))

        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })
        if (user) {
            return res.status(205).send({
                status: "error",
                data: {},
                message: "Username already taken"
            })
        }

        const {passwordRepeat, ...dataForCreate} = data
        const newUser = await prisma.user.create({
            data: {
                ...dataForCreate
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
        if (req.session.userId) {
            return res.status(206).send({
                status: "error",
                data: {},
                message: "Already logged in"
            });
        }
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
            return res.status(206).send({
                status: "error",
                data: {},
                message: "Invalid username"
            });
        }

        const givenPasswordHash = new TextDecoder().decode(sha256(Buffer.from(data.password)))
        if (givenPasswordHash !== user.password) {
            return res.status(207).send({
                status: "error",
                data: {},
                message: "Invalid password"
            });
        }
        console.log("LOOL")
        req.session.userId = user.id
        console.log(req.session.userId)

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

const userUpdateSchema = object({
    username: string().optional(),
    password: string().optional(),
    aboutMe: string().optional(),
    profilePicture: string().optional()
});

export const update = async (req: Request, res: Response) => {
    try {
        const data = await userUpdateSchema.validate(req.body)
        //const senderId = req.header('X-User')!

        if (req.params.id !== req.session.userId) {
            return res.status(403).send({
                status: "error",
                data: {},
                message: "Not authorized to update given profile"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        })

        if (!user) {
            return res.status(400).send({
                status: "error",
                data: {},
                message: "User not found"
            })
        }

        if (data.password) {
            data.password = new TextDecoder().decode(sha256(Buffer.from(data.password)))
        }

        if (data.username) {
            const usernameTaken = await prisma.user.findUnique({
                where: {
                    username: data.username
                }
            })
            if (usernameTaken) {
                return res.status(400).send({
                    status: "error",
                    data: {},
                    message: "Username already taken"
                })
            }
        }


        const updatedUser = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                ...data,
            },
            select: {
                id: true
            }
        })
        return res.send({
            status: "success",
            data: updatedUser,
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

export const logout = (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({
                status: "error",
                data: {},
                message: "Something went wrong"
            });
        }
        res.clearCookie("test")
        return res.send({
            status: "success",
            data: {},
            message: "Successfully logged out"
        })
    })
}

export const loggedUser = (req: Request, res: Response) => {
    return res.send({
        status: "success",
        data: {
            userId: req.session.userId
        }
    })
}

export const checkLogin = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
        return res.status(221).send({
            status: "error",
            data: {},
            message: "Not logged in"
        });
    }
    next()
}
