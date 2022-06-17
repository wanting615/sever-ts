import { JwtPayload, verify } from "jsonwebtoken";

interface UserInfo extends JwtPayload{
  username: string;
  password: string;
}

class UntilService {
  tokenConfig = {privateKey: "wanting615"};
  // 验证token
  verifyToken(token: string): boolean{
    const userInfo:UserInfo   = verify(token,this.tokenConfig.privateKey) as UserInfo;
    if( userInfo.password === "123456" && userInfo.username === "admin"){
      return true;
    }
    return false;
  }
}
export default  new UntilService();