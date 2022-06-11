import {GameProps} from './Game'

export interface GenreProps{
    id:string,
    name:string,
    description:string,
    games:GameProps[]
}