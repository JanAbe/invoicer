"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * UserChannel manages all user related channels
 * used by IPC for communicating with the renderer process of electron
 */
class UserChannelManager {
    constructor(ipcMain, userService) {
        this.ipcMain = ipcMain;
        this.userService = userService;
    }
    initChannels() {
        this.initSubmit();
    }
    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit user event.
     */
    initSubmit() {
        const listenChannel = 'submit-user-channel';
        const replyChannel = 'submit-user-reply-channel';
        this.ipcMain.on(listenChannel, (event, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.userService.createUser(user);
                if (id !== "") {
                    event.reply(replyChannel, id);
                }
            }
            catch (e) {
                console.log(e);
            }
        }));
    }
}
exports.UserChannelManager = UserChannelManager;
//# sourceMappingURL=userChannelManager.js.map