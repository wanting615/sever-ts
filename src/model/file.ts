import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";

@modelOptions({ options: { customName: "finds", allowMixed: 0 } })
class File {
  @prop({ required: true })
  user_id: number;//用户id

  @prop({ required: true })
  shop_id: number;//商店id

  @prop({ required: true })
  proId: number;//文件类型id == 头像 1 or 店面图 2 等等

  @prop({ default: "" })
  fileName: string;//文件名

  @prop({ default: "" })
  filePath: string;//文件路径

  @prop({ default: "" })
  fileType: string;//文件类型

  @prop({ default: "" })
  fileHash: string;//文件hash值

  @prop({ default: 0 })
  size: number;//文件大小

  @prop({ default: Date.now })
  uploadTime?: Date;//上传时间


  public static async findFilesById(this: ReturnModelType<typeof File>, proId: number) {
    return this.findOne({ proId });
  }

  public static async findFilesByFileHash(this: ReturnModelType<typeof File>, fileHash: string) {
    return this.findOne({ fileHash });
  }

  public static async delFiles(this: ReturnModelType<typeof File>, proId: number) {
    return this.remove({ proId });
  }
}

const FileModel = getModelForClass(File);

export { FileModel };