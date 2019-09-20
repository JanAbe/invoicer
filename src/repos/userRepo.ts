import { UserDTO } from "../domain/dto/userDTO";

export interface UserRepo {
    userOfID(userID: string): Promise<UserDTO>;

    save(user: UserDTO, id: string): void;
}