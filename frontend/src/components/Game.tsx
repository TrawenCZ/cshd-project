import {ImageProps} from './Image'
import {ReviewProps} from './Review'

export interface GameProps{
    name:string,
    pictures:ImageProps[],
    description: string,
    officialPage: string,
    rating: number,
    releaseDate: Date,
    gameModes: string[],
    genres: string[],
    developer: string,
    developerId: string,
    platforms: string[],
    reviews: ReviewProps[]
}
