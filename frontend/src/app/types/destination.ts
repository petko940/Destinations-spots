import { User } from "./user";

export interface Destination {
    id: number;
    name: string;
    description: string;
    photo: string;
    latitude: number;
    longitude: number;
    location: string;
    modified_at: string;
    user: number;
}
