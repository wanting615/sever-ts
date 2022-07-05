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
const user_1 = require("../model/user");
const ids_1 = require("../model/ids");
const rsa_1 = __importDefault(require("../until/rsa"));
const address_1 = __importDefault(require("../until/address"));
const formater_1 = require("../until/formater");
const checkPermission_1 = require("../middleware/checkPermission");
let UserController = class UserController {
    static async login(ctx) {
        const body = ctx.validatedBody;
        ctx.body = { message: "", status: false, data: null };
        if (!body.token) {
            ctx.fail("参数不能为空");
            return;
        }
        const paramsStr = rsa_1.default.decrypt(body.token);
        if (!paramsStr) {
            ctx.fail("参数错误");
            return;
        }
        const { username, password } = rsa_1.default.strParse(paramsStr);
        if (!username) {
            ctx.fail("请输入用户名");
            return;
        }
        if (!password) {
            ctx.fail("请输入密码");
            return;
        }
        const passwordMd5 = rsa_1.default.encryption(password);
        try {
            const user = await user_1.UserModel.findUser(username);
            if (!user) { //不存在用户-直接注册
                const user_id = await ids_1.IdsModel.getIds("user_id");
                //user表创建
                // UserModel.addUser(username, passwordMd5, user_id);
                const userDoc = new user_1.UserModel({
                    username,
                    user_id: user_id,
                    password: passwordMd5
                });
                userDoc.save();
                //UserInfo表创建信息
                let city = "上海";
                try {
                    const cityInfo = await address_1.default.guessPosition(ctx);
                    city = cityInfo.city;
                }
                catch (error) {
                    console.log(error);
                }
                const registe_time = (0, formater_1.useFormatTime)("YYYY-mm-dd HH:MM", new Date());
                // const userInfo = await UserModel.addUserInfo(user_id, user_id, username, city, registe_time);
                const doc = new user_1.UserInfoModel({
                    id: user_id,
                    user_id,
                    username,
                    city,
                    registe_time
                });
                const userInfo = await doc.save();
                ctx.success(userInfo, "注册成功");
            }
            else if (user.password.toString() !== passwordMd5) { //密码不对
                ctx.fail("密码错误");
            }
            else {
                const userInfo = await user_1.UserInfoModel.findUserInfo(user.user_id);
                ctx.success(userInfo, "登陆成功");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    static async delUser(ctx) {
        const { user_id } = ctx.request.query;
        const user = await user_1.UserModel.findUserById(parseInt(user_id));
        if (user.user_id === 6) {
            await user_1.UserModel.delUser(parseInt(user_id));
            await user_1.UserInfoModel.delUserInfo(parseInt(user_id));
            ctx.success(null, "删除成功");
        }
        else {
            ctx.fail("无权限");
        }
    }
    static async getUserInfo(ctx) {
        try {
            const userInfo = await user_1.UserInfoModel.findUserInfo(Number(ctx.query.user_id));
            ctx.success(userInfo, "删除成功");
        }
        catch (error) {
            ctx.fail("异常");
        }
    }
    static async addUserAddress(ctx) {
        const { user_id, id, name, sex, phone, lng, lat, city, adname, address, addressName, addressDetail, tag, } = ctx.request.body;
        if (!name) {
            ctx.fail("收货人姓名不能为空");
            return;
        }
        if (!phone) {
            ctx.fail("收货人手机号不能为空");
            return;
        }
        if (!lng || !lat) {
            ctx.fail("用户定位失败");
            return;
        }
        if (!city || !address || !addressName || !addressDetail) {
            ctx.fail("收货人地址不能为空");
            return;
        }
        try {
            const userAddressInfo = {
                name,
                phone,
                sex,
                st_geohash: lat + "," + lng,
                city_name: city,
                area_name: adname,
                address_name: addressName,
                address,
                addressDetail,
                tag,
                tag_type: tag === "家" ? 1 : tag === "公司" ? 2 : 3
            };
            let userAddress;
            if (id) {
                userAddress = await user_1.UserAddressModel.updateUserAddress(Number(user_id), Number(id), userAddressInfo);
            }
            else {
                const id = await ids_1.IdsModel.getIds("address_id");
                userAddress = new user_1.UserAddressModel(Object.assign(userAddressInfo, {
                    id,
                    user_id: Number(user_id),
                }));
                await userAddress.save();
            }
            ctx.success(userAddress, "修改成功");
        }
        catch (error) {
            ctx.fail("服务器异常");
            throw new Error(error);
        }
    }
    static async delUserAddress(ctx) {
        try {
            const { id, user_id } = ctx.request.query;
            if (!id) {
                ctx.fail("id不能位空");
                return;
            }
            const userAddress = await user_1.UserAddressModel.findUserAddressById(Number(id));
            if (!userAddress) {
                ctx.fail("用户地址不存在");
                return;
            }
            if (userAddress.user_id !== Number(user_id)) {
                ctx.fail("非法操作");
                return;
            }
            user_1.UserAddressModel.delUserAddress(Number(user_id), Number(id));
            ctx.success(null, "删除成功");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    static async getUserAddress(ctx) {
        const user_id = Number(ctx.request.query.user_id);
        try {
            const addresses = await user_1.UserAddressModel.findUserAddress(user_id);
            const data = [];
            addresses.forEach(item => {
                data.push({
                    id: item.id,
                    name: item.name,
                    sex: item.sex,
                    phone: item.phone,
                    lng: item.st_geohash.split(",")[0],
                    lat: item.st_geohash.split(",")[1],
                    city: item.city_name,
                    adname: item.area_name,
                    address: item.address,
                    addressDetail: item.addressDetail,
                    addressName: item.address_name,
                    tag: item.tag
                });
            });
            ctx.success(data, "查询成功");
        }
        catch (error) {
            ctx.fail("查询失败");
            throw new Error(error);
        }
    }
    static async getUserAddressByTime(ctx) {
        const user_id = Number(ctx.request.query.user_id);
        const from = ctx.request.query.from;
        try {
            const addresses = await user_1.UserAddressModel.findUserAddress(user_id);
            const data = [];
            let to = "";
            addresses.forEach((item, index) => {
                to = index === (addresses.length - 1) ? to + item.st_geohash : to + item.st_geohash + ";";
            });
            const timeArr = await address_1.default.getDistanceTime(from, to);
            addresses.forEach((item, index) => {
                data.push({
                    id: item.id,
                    name: item.name,
                    sex: item.sex,
                    phone: item.phone,
                    lng: item.st_geohash.split(",")[0],
                    lat: item.st_geohash.split(",")[1],
                    city: item.city_name,
                    adname: item.area_name,
                    address: item.address,
                    addressDetail: item.addressDetail,
                    addressName: item.address_name,
                    tag: item.tag,
                    orderLeadTime: timeArr[index].order_lead_time
                });
            });
            ctx.success(data, "查询成功");
        }
        catch (error) {
            ctx.fail("查询失败");
            throw new Error(error);
        }
    }
};
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/login"),
    (0, koa_swagger_decorator_1.summary)("登陆"),
    (0, koa_swagger_decorator_1.body)(user_1.User),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "login", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/delUser"),
    (0, koa_swagger_decorator_1.summary)("删除用户"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.query)({
        user_id: {
            type: "string",
            description: "admin user_id"
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "delUser", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/userInfo"),
    (0, koa_swagger_decorator_1.summary)("查询用户详细信息"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getUserInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/addUserAddress"),
    (0, koa_swagger_decorator_1.summary)("添加收货地址 or 更新收货地址"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.body)(user_1.UserAddress),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "addUserAddress", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/delUserAddress"),
    (0, koa_swagger_decorator_1.summary)("删除收货地址"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.query)({
        id: { type: "number" }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "delUserAddress", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getUserAddress"),
    (0, koa_swagger_decorator_1.summary)("获取收货地址"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getUserAddress", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getUserAddressByTime"),
    (0, koa_swagger_decorator_1.summary)("获取收货地址 外带到收货地址所需时间"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.query)({
        from: { type: "string" }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getUserAddressByTime", null);
UserController = __decorate([
    (0, koa_swagger_decorator_1.prefix)("/user")
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.js.map