import {ReviewProps} from './Review'

export interface UserProps{
    id:string,
    username:string,
    password:string,
    aboutMe:string,
    isAdmin:boolean,
    profilePicture:string,
    reviews:ReviewProps[],
    userId:string
}