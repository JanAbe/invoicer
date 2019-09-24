import { ChannelManager } from "./channelManager";
import { IpcMain } from "electron";
import { SqliteUserRepo } from "../../repos/sqlite/sqliteUserRepo";
import { UserDTO } from "../../domain/dto/userDTO";
import { DB } from "../../db";

/**
 * UserChannel manages all user related channels
 * used by IPC for communicating with the renderer process of electron
 */
export class UserChannelManager implements ChannelManager {
    private readonly ipcMain: IpcMain;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    public initChannels(): void {
        this.initSubmit();
    }

    // todo: add user table to db containing all general info data
    // like iban, name, etc.
    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit user event.
     */
    private initSubmit(): void {
        const listenChannel = 'submit-user-channel';
        const replyChannel = 'submit-user-reply-channel';

        this.ipcMain.on(listenChannel, async (event, user) => {
            try {
                const dbLocation = `${__dirname}/../../../db/Invoice.db`;
                const db = new DB(dbLocation);
                const sqliteUserRepo = new SqliteUserRepo(db);

                const userDTO = new UserDTO(
                    user['id'],
                    user['firstName'],
                    user['lastName'],
                    user['iban'],
                    user['companyName'],
                    user['jobTitle'],
                    user['bankAccountNr'],
                    user['phoneNr'],
                    user['mobileNr'],
                    user['email'],
                    user['coc'],
                    user['vatNr'],
                    user['varNr'],
                    user['city'],
                    user['zipcode'],
                    user['street'],
                    user['houseNr']
                );

                // todo: make userService instead of directly talking to repo
                const id = await sqliteUserRepo.saveOrdUpdate(userDTO);
                if (id !== "") {
                    event.reply(replyChannel, id);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
}