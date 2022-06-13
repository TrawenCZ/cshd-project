import {GameProps} from './Game'

export interface GameModeProps{
    id:string,
    name:string,
    description:string,
    games:GameProps[]
}