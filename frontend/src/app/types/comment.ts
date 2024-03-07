import { Destination } from "./destination"

export interface Comment {
    id: number;
    destination: Destination;
    name: string;
    comment: string;
}