import {GameProps} from './Game'

export interface PlatformProps{
    id:string,
    name:string,
    description:string,
    officialPage:string,
    games:GameProps[]
}