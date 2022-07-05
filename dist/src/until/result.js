"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routerResponse() {
    return async function (ctx, next) {
        ctx.success = function (data, msg) {
            ctx.body = {
                status: true,
                message: msg,
                data: data
            };
        };
        ctx.fail = function (msg) {
            ctx.body = {
                status: false,
                message: msg
            };
        };
        await next();
    };
}
exports.default = routerResponse;
//# sourceMappingURL=result.js.map