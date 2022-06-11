import {GameProps} from './Game'
import {UserProps} from './User'


export interface ReviewProps{
    id:string,
    header:string,
    rating:number,
    description:string,
    game:GameProps,
    gameId:string,
    user:UserProps,
    userId:string
}