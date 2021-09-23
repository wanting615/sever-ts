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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const file_1 = require("../model/file");
const path_2 = require("../config/path");
class FindController {
    // @middlewares([needLogin])
    async addFind(ctx) {
        try {
            const params = ctx.request.body; //上传其它的参数
            const file = ctx.request.files.file; // 获取上传文件
            // 创建可读流
            if (Array.isArray(file)) {
                return;
            }
            ;
            const reader = fs_1.default.createReadStream(file.path);
            const filePath = path_1.default.join("./", 'public/files/') + `${file.name}`;
            //生成hash 校验是否上传相同文件
            const fsHash = crypto_1.default.createHash('md5');
            const buffer = fs_1.default.readFileSync(file.path);
            fsHash.update(buffer);
            const fileHash = fsHash.digest('hex');
            console.log('文件的MD5是：%s', fileHash);
            const result = await file_1.FileModel.findFilesByFileHash(fileHash);
            if (!params.shopId) {
                ctx.body = { status: false, message: '商店id不能为空' };
                return;
            }
            if (!result) {
                // const addResult = await FileModel.addFiles(Number(params.userId), Number(params.shopId), params.projectId, file.name, filePath, file.type, fileHash, file.size);
                const addResult = new file_1.FileModel({
                    user_id: Number(params.userId),
                    shop_id: Number(params.shopId),
                    proId: params.projectId,
                    fileName: file.name,
                    filePath,
                    fileType: file.type,
                    fileHash,
                    size: file.size
                });
                await addResult.save();
                if (!addResult)
                    return;
                // 创建可写流
                const upStream = fs_1.default.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
                ctx.body = {
                    status: true,
                    message: "文件上传成功",
                    url: `${path_2.localPath}/${filePath}`,
                };
            }
            else {
                ctx.body = {
                    status: false,
                    message: "文件已存在",
                    url: `${path_2.localPath}/${filePath}`,
                };
            }
        }
        catch (error) {
            console.log(error);
            ctx.body = {
                status: true,
                message: "文件上传失败"
            };
        }
    }
    async delFile(ctx) {
        const fileId = ctx.request.query.fileId;
        try {
            const file = await file_1.FileModel.findFilesById(Number(fileId));
            if (file) {
                const filePath = path_1.default.resolve(file.filePath);
                if (fs_1.default.existsSync(filePath)) {
                    await file_1.FileModel.delFiles(Number(fileId));
                    fs_1.default.unlinkSync(filePath);
                    ctx.body = {
                        status: true,
                        message: '删除成功'
                    };
                }
                else {
                    ctx.body = {
                        status: false,
                        message: '删除失败'
                    };
                }
            }
            else {
                ctx.body = {
                    status: false,
                    message: '文件不存在'
                };
            }
        }
        catch (error) {
            console.log(error);
            ctx.body = {
                status: false,
                message: '服务器异常'
            };
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/fileUpload'),
    (0, koa_swagger_decorator_1.summary)('添加文件'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "addFind", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/delFile'),
    (0, koa_swagger_decorator_1.summary)('删除文件'),
    (0, koa_swagger_decorator_1.query)({
        fileId: { type: 'number', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "delFile", null);
exports.default = FindController;
//# sourceMappingURL=file.js.map