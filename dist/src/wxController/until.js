"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const files_1 = require("../until/files");
class UntilService {
    constructor() {
        this.tokenConfig = { privateKey: "wanting615" };
    }
    // 验证后台token
    async verifyToken(token) {
        try {
            const userInfo = (0, jsonwebtoken_1.verify)(token, this.tokenConfig.privateKey);
            const result = await (0, files_1.readfile)("../../user.json");
            if (result && userInfo.password === result.password && userInfo.username === result.username) {
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    // 生成小程序token
    createToken(openid) {
        return (0, jsonwebtoken_1.sign)({ openid }, this.tokenConfig.privateKey, { expiresIn: "100 days" });
    }
    // 校验小程序token
    verifywxToken(token) {
        if (!token) {
            return "";
        }
        const params = (0, jsonwebtoken_1.verify)(token, this.tokenConfig.privateKey);
        return params.openid;
    }
}
exports.default = new UntilService();
//# sourceMappingURL=until.js.map