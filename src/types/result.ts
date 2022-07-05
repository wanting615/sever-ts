// import { Request } from "koa";
// import { DocumentType } from "@typegoose/typegoose";
// import { Context } from "koa-swagger-decorator";

// // 返回总类型
// export interface Result<T = unknown> {
//   message: string;
//   status: boolean;
//   data?: T;
//   [propName: string]: unknown;
// }

// interface OwnRequest extends Request{
//   body:{
//    [key in  string]: unknown
//   }
// }

// export interface ContextRes<T = null> extends Context{
//   body: Result<T>,
//   request: OwnRequest
// }

// // data 类型
// export type  ResultDataType<T> = DocumentType<T, Record<string, unknown>>