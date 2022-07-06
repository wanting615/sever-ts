import { JwtPayload, sign, verify } from "jsonwebtoken";

interface UserInfo extends JwtPayload{
  username: string;
  password: string;
}

class UntilService {
  tokenConfig = {privateKey: "wanting615"};
  // 验证后台token
  verifyToken(token: string): boolean{
   try {
      const userInfo:UserInfo   = verify(token,this.tokenConfig.privateKey) as UserInfo;
      if( userInfo.password === "123456" && userInfo.username === "admin"){
        return true;
      }
      return false;
   } catch (error) {
    return false;
   }
  }

  // 生成小程序token
  createToken(openid: string): string{
    return sign({openid}, this.tokenConfig.privateKey, {expiresIn: "100 days"});
  }

  // 校验小程序token
  verifywxToken(token: string): string{
    if(!token) { return "";}
    const params =  verify(token, this.tokenConfig.privateKey) as {openid: string} ;
    return params.openid;
  }
}
export default  new UntilService();