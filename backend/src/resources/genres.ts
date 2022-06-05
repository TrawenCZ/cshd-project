import {number, object, string, ValidationError} from 'yup';
import {Request, Response} from 'express'
import prisma from '../client';

export const getAll = async () => {
    try {
        return await prisma.accomodation.findMany();
    } catch (e) {
        console.log(e);
        return null;
    }
}
