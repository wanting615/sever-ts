import { middlewares, query, request, summary } from "koa-swagger-decorator";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { needLogin } from "../middleware/checkPermission";
import { FileModel } from "../model/file";
import { localPath } from "../config/path";

export default class FindController {
  @request("post", "/fileUpload")
  @summary("添加文件")
  @middlewares([needLogin])
  async addFind(ctx: Ctx): Promise<void>{
    try {
      const params = ctx.request.body;//上传其它的参数
      const file = ctx.request.files.file; // 获取上传文件
      // 创建可读流
      if (Array.isArray(file)) { return; }
      const reader = fs.createReadStream(file.path);
      const filePath = path.join(path.resolve(__dirname, "../.."), "webContent/files/") + `${file.name}`;
      //生成hash 校验是否上传相同文件
      const fsHash = crypto.createHash("md5");
      const buffer = fs.readFileSync(file.path);
      fsHash.update(buffer);
      const fileHash = fsHash.digest("hex");
      console.log("文件的MD5是：%s", fileHash);

      const result = await FileModel.findFilesByFileHash(fileHash);
      if (!params.shopId) { ctx.fail("商店id不能为空"); return; }
      if (!result) {
        // const addResult = await FileModel.addFiles(Number(params.userId), Number(params.shopId), params.projectId, file.name, filePath, file.type, fileHash, file.size);
        const addResult = new FileModel({
          user_id: Number(1),
          shop_id: Number(1),
          proId: 1,
          fileName: file.name,
          filePath: `files/${file.name}`,
          fileType: file.type,
          fileHash,
          size: file.size
        });
        await addResult.save();
        if (!addResult) return;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        ctx.body = {
          status: true,
          message: "文件上传成功",
          url: `${localPath}/${filePath}`,
        };
      } else {
        ctx.body = {
          status: false,
          message: "文件已存在",
          url: `${localPath}/${filePath}`,
        };
      }
    } catch (error) {
      console.log(error);
      ctx.fail("文件上传失败");
    }
  }

  @request("get", "/delFile")
  @summary("删除文件")
  @query({
    fileId: { type: "number", require: true }
  })
  async delFile(ctx: Ctx): Promise<void>{
    const fileId = ctx.request.query.fileId;
    try {
      const file = await FileModel.findFilesById(Number(fileId));
      if (file) {
        const filePath = path.resolve(file.filePath);
        if (fs.existsSync(filePath)) {
          await FileModel.delFiles(Number(fileId));
          fs.unlinkSync(filePath);
          ctx.success(null, "删除成功");
        } else {
          ctx.fail("删除失败");
        }
      } else {
        ctx.fail("文件不存在");
      }

    } catch (error) {
      console.log(error);
      ctx.fail("服务器异常");
    }

  }
}