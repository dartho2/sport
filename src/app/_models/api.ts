import { Role } from "./role";

export class Api {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    auth_token?: string;
}