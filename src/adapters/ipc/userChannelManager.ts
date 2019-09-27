import { ChannelManager } from "./channelManager";
import { IpcMain } from "electron";
import { UserService } from "../../application/userService";

/**
 * UserChannel manages all user related channels
 * used by IPC for communicating with the renderer process of electron
 */
export class UserChannelManager implements ChannelManager {
    private readonly ipcMain: IpcMain;
    private readonly userService: UserService;

    constructor(ipcMain: IpcMain, userService: UserService) {
        this.ipcMain = ipcMain;
        this.userService = userService;
    }

    public initChannels(): void {
        this.initSubmit();
    }

    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit user event.
     */
    private initSubmit(): void {
        const listenChannel = 'submit-user-channel';
        const replyChannel = 'submit-user-reply-channel';

        this.ipcMain.on(listenChannel, async (event, user) => {
            try {
                const id = await this.userService.createUser(user);
                if (id !== "") {
                    event.reply(replyChannel, id);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
}