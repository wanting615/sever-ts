"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var File_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let File = File_1 = class File {
    static async findFilesById(proId) {
        return this.findOne({ proId });
    }
    static async findFilesByFileHash(fileHash) {
        return this.findOne({ fileHash });
    }
    static async delFiles(proId) {
        return this.remove({ proId });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], File.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], File.prototype, "shop_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], File.prototype, "proId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], File.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], File.prototype, "filePath", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], File.prototype, "fileType", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], File.prototype, "fileHash", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], File.prototype, "uploadTime", void 0);
File = File_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: "finds", allowMixed: 0 } })
], File);
const FileModel = (0, typegoose_1.getModelForClass)(File);
exports.FileModel = FileModel;
//# sourceMappingURL=file.js.map