import {GameProps} from './Game'

export interface DeveloperProps{
    id:string,
    name:string,
    description:string,
    games:GameProps[]
}