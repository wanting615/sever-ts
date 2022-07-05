// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/global.d.ts" />
import { Context } from "koa";
export {};

declare global {
  interface Ctx extends Context {
    success<T = null>(data: T, msg: string): void;
    fail(msg: string): void;
  }
}