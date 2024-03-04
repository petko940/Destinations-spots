import { Destination } from "./destination";
import { User } from "./user";

export interface Rating {
    destination: Destination,
    user: User,
    stars: number
}