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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var job_1 = require("../domain/job");
var jobID_1 = require("../domain/jobID");
var clientID_1 = require("../domain/clientID");
var equipmentItem_1 = require("../domain/equipmentItem");
var period_1 = require("../domain/period");
var cameraman_1 = require("../domain/cameraman");
var jobDTO_1 = require("../domain/jobDTO");
var util_1 = require("util");
var SqliteJobRepo = /** @class */ (function () {
    function SqliteJobRepo(db) {
        this._db = db;
    }
    SqliteJobRepo.prototype.nextID = function () {
        return new jobID_1.JobID(uuid());
    };
    // todo: write code to handle missing cameraman rows and equipment-item rows
    // as not each job needs to have both
    // can also check to see if the queries can be rewritten so only 1 query is neccessary
    // gotta look into different type of joins i think
    SqliteJobRepo.prototype.jobOfID = function (jobID) {
        return __awaiter(this, void 0, void 0, function () {
            var jobDTO, cameramanQuery, equipmentItemQuery, jobQuery;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobDTO = new jobDTO_1.JobDTO();
                        cameramanQuery = 'SELECT r.start_date, r.end_date, r.day_price, c.firstName, c.lastName FROM Rented_Entity r JOIN Cameraman c ON (r.ref_cameraman = c.id) WHERE r.ref_job = ?;';
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this._db.db.get(cameramanQuery, jobID.toString(), function (err, row) {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    }
                                    else {
                                        if (row !== undefined) {
                                            var cameraman = new cameraman_1.Cameraman(row.firstName, row.lastName, row.day_price, new period_1.Period(new Date(row.start_date), new Date(row.end_date)));
                                            jobDTO.cameraman = cameraman;
                                        }
                                        resolve();
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        equipmentItemQuery = 'SELECT r.start_date, r.end_date, r.day_price, e.name from Rented_Entity r JOIN Equipment_Item e ON (r.ref_equipment_item = e.id) WHERE r.ref_job = ?;';
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this._db.db.all(equipmentItemQuery, jobID.toString(), function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    }
                                    else {
                                        if (rows !== undefined) {
                                            rows.forEach(function (row) {
                                                var equipmentItem = new equipmentItem_1.EquipmentItem(row.name, row.day_price, new period_1.Period(new Date(row.start_date), new Date(row.end_date)));
                                                jobDTO.equipmentItems.push(equipmentItem);
                                            });
                                        }
                                        resolve();
                                    }
                                });
                            })];
                    case 2:
                        _a.sent();
                        jobQuery = 'SELECT id, description, location, directed_by, ref_client FROM Job WHERE id = ?;';
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this._db.db.get(jobQuery, jobID.toString(), function (err, row) {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    }
                                    else {
                                        jobDTO.id = new jobID_1.JobID(row.id);
                                        jobDTO.directedBy = row.directed_by;
                                        jobDTO.description = row.description;
                                        jobDTO.location = row.location;
                                        jobDTO.clientID = new clientID_1.ClientID(row.ref_client);
                                        resolve();
                                    }
                                });
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                resolve(job_1.Job.fromDTO(jobDTO));
                            })];
                }
            });
        });
    };
    SqliteJobRepo.prototype.save = function (job) {
        var _this = this;
        var jobQuery = 'INSERT INTO Job (id, description, location, directed_by, ref_client) VALUES (?, ?, ?, ?, ?);';
        this._db.run(jobQuery, [
            job.id.toString(),
            job.description,
            job.location,
            job.directedBy,
            job.clientID.toString()
        ]);
        var rentedEntityQuery = 'INSERT INTO Rented_Entity (id, start_date, end_date, day_price, ref_job, ref_cameraman, ref_equipment_item) VALUES (?, ?, ?, ?, ?, ?, ?);';
        if (!util_1.isNullOrUndefined(job.cameraman)) {
            var cameramanQuery = 'INSERT INTO Cameraman (id, firstName, lastName) VALUES (?, ?, ?);';
            var cameramanID = uuid();
            this._db.run(cameramanQuery, [
                cameramanID,
                job.cameraman.firstName,
                job.cameraman.lastName
            ]);
            var rentedEntityID_1 = uuid();
            this._db.run(rentedEntityQuery, [
                rentedEntityID_1,
                job.cameraman.period.startDate.toISOString(),
                job.cameraman.period.endDate.toISOString(),
                job.cameraman.dayPrice,
                job.id.toString(),
                cameramanID,
                null
            ]);
        }
        var equipmentItemQuery = 'INSERT INTO Equipment_Item (id, name) VALUES (?, ?);';
        var equipmentItemID;
        var rentedEntityID;
        job.equipmentItems.forEach(function (e) {
            equipmentItemID = uuid();
            _this._db.run(equipmentItemQuery, [
                equipmentItemID,
                e.name
            ]);
            rentedEntityID = uuid();
            _this._db.run(rentedEntityQuery, [
                rentedEntityID,
                e.period.startDate.toISOString(),
                e.period.endDate.toISOString(),
                e.dayPrice,
                job.id.toString(),
                null,
                equipmentItemID
            ]);
        });
    };
    return SqliteJobRepo;
}());
exports.SqliteJobRepo = SqliteJobRepo;
//# sourceMappingURL=sqliteJobRepo.js.map