import { UserDTO } from "../domain/dto/userDTO";

export interface UserRepo {

    /**
     * @param userID id of the requested user
     * @returns user that is identified by the provided id
     */ 
    userOfID(userID: string): Promise<UserDTO>;

    /**
     * saves the user if it doesn't exist in the db yet, or updates
     * the user if it does.
     * @param user user properties needed to store a user
     * @returns id of the newly saved user or an empty string if the user was updated
     */
    saveOrUpdate(user: UserDTO): Promise<string>;
}