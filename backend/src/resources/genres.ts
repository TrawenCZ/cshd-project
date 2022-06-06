import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prismaClient from '../client';



export const getAll = async () => {
    try {
        return await prismaClient.game;
    } catch (e) {
        console.log(e);
        return null;
    }
}
