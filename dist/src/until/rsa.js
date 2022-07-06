"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_rsa_1 = __importDefault(require("node-rsa"));
const crypto_1 = __importDefault(require("crypto"));
class RsaDecrypt {
    // constructor() {
    //   //密钥
    //   this.privatekey = `MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAq1MKiqPPPBWorB8MD3Y3gnVMgjPh6rgKkjTAeFLdE17D17jtl3Al5zhKZFPLEWQb8WWskLtXAbSs/2Ak+pSTgwIDAQABAkBHkrqdrs+dx2Ke/Z15PCb2jnB3GJuyBk8MQ5OA8QVA2K/ubsiVz+eK+UvSq8cUM+qwTa/eu2nV2rukmGc0PVXJAiEA3ar/r1IT8eFejwgkWGtPYwJasKtzsh6OrAC3yWo3UcUCIQDF2/MaMTJNL3qwTJCZXkVtw+NYwhoE3Wu5UnkCjZUMpwIgVApz2/WDaE4oupO8q+UreP84gQjP2XUqZF31UCC8Dn0CIQCM+77riOaYzR4VBVl7jwrVveD/W7+Ce+vIb5W+VfhAvQIhANryHJ3ZroRqZ13iHjgxmliVi0w/PZC731haJu5BhV9z`
    //   // 生成公钥密钥
    //   // var key = new NodeRSA({ b: 512 });
    //   // key.setOptions({ encryptionScheme: 'pkcs1' });//指定加密格式
    //   // //2.生成 公钥私钥，使用 pkcs8标准，pem格式
    //   // var publicPem = key.exportKey('pkcs8-public-pem');//制定输出格式
    //   // var privatePem = key.exportKey('pkcs8-private-pem');
    //   // console.log('公钥:\n', publicPem);
    //   // console.log('私钥:\n', privatePem);
    // }
    static decrypt(token) {
        let decryptedData;
        const str = decodeURIComponent(token);
        try {
            const rsa = new node_rsa_1.default(this.privatekey, "pkcs8-private-pem", { encryptionScheme: "pkcs1" });
            decryptedData = rsa.decrypt(str, "utf8");
        }
        catch (error) {
            console.log(error);
            return "";
        }
        return decryptedData;
    }
    // 
    /**
     * 序列化解密后的请求参数
     * @param {*} str eg:username=wanting&password=123456
     * @returns
     */
    static strParse(paramsStr) {
        const object = {};
        try {
            const strArr = paramsStr.split("&");
            for (let i = 0; i < strArr.length; i++) {
                const key = strArr[i].split("=")[0];
                const value = strArr[i].split("=")[1];
                object[key] = value;
            }
        }
        catch (error) {
            return {};
        }
        return object;
    }
    static encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword;
    }
    static Md5(password) {
        const md5 = crypto_1.default.createHash("md5");
        return md5.update(password).digest("base64");
    }
}
RsaDecrypt.privatekey = "MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAq1MKiqPPPBWorB8MD3Y3gnVMgjPh6rgKkjTAeFLdE17D17jtl3Al5zhKZFPLEWQb8WWskLtXAbSs/2Ak+pSTgwIDAQABAkBHkrqdrs+dx2Ke/Z15PCb2jnB3GJuyBk8MQ5OA8QVA2K/ubsiVz+eK+UvSq8cUM+qwTa/eu2nV2rukmGc0PVXJAiEA3ar/r1IT8eFejwgkWGtPYwJasKtzsh6OrAC3yWo3UcUCIQDF2/MaMTJNL3qwTJCZXkVtw+NYwhoE3Wu5UnkCjZUMpwIgVApz2/WDaE4oupO8q+UreP84gQjP2XUqZF31UCC8Dn0CIQCM+77riOaYzR4VBVl7jwrVveD/W7+Ce+vIb5W+VfhAvQIhANryHJ3ZroRqZ13iHjgxmliVi0w/PZC731haJu5BhV9z";
exports.default = RsaDecrypt;
//# sourceMappingURL=rsa.js.map