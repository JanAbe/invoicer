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
const sqliteUserRepo_1 = require("../../repos/sqlite/sqliteUserRepo");
const userDTO_1 = require("../../domain/dto/userDTO");
const db_1 = require("../../db");
/**
 * UserChannel manages all user related channels
 * used by IPC for communicating with the renderer process of electron
 */
class UserChannelManager {
    constructor(ipcMain) {
        this.ipcMain = ipcMain;
    }
    initChannels() {
        this.initSubmit();
    }
    // todo: add user table to db containing all general info data
    // like iban, name, etc.
    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit user event.
     */
    initSubmit() {
        const listenChannel = 'submit-user-channel';
        const replyChannel = 'submit-user-reply-channel';
        this.ipcMain.on(listenChannel, (event, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dbLocation = `${__dirname}/../../../db/Invoice.db`;
                const db = new db_1.DB(dbLocation);
                const sqliteUserRepo = new sqliteUserRepo_1.SqliteUserRepo(db);
                const userDTO = new userDTO_1.UserDTO(user['id'], user['firstName'], user['lastName'], user['iban'], user['companyName'], user['jobTitle'], user['bankAccountNr'], user['phoneNr'], user['mobileNr'], user['email'], user['coc'], user['vatNr'], user['varNr'], user['city'], user['zipcode'], user['street'], user['houseNr']);
                // todo: make userService instead of directly talking to repo
                const id = yield sqliteUserRepo.saveOrdUpdate(userDTO);
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