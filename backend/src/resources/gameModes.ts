import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const list = async (req: Request, res: Response) => {
  try {
    const page = +(req.query.page || 0)

    const gameModes = await prisma.gameMode.findMany({
      skip: page * 10,
      take: 10,
    })
    return res.send({
      status: "success",
      data: gameModes,
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
    const gameMode = await prisma.gameMode.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        games: {
          select: {
            id: true,
            name: true,
            coverPicture: true
          }
        }
      }
    })
    return res.send({
      status: "success",
      data: gameMode,
    })
  } catch (e) {
    return res.status(500).send({
      status: "error",
      data: {},
      message: "Something went wrong"
    });
  }
}
