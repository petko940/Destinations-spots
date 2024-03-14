import { User } from "./user";

export interface Destination {
    id: number;
    name: string;
    description: string;
    photo: string;
    latitude: number;
    longitude: number;
    modified_at: string;
    user: User;
}
