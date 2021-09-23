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
var User_1, UserInfo_1, UserAddress_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddress = exports.User = exports.UserAddressModel = exports.UserInfoModel = exports.UserModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
//用户
let User = User_1 = class User {
    //查询用户
    static async findUser(username) {
        return this.findOne({ username });
    }
    //查询用户 by userid
    static async findUserById(user_id) {
        return this.findOne({ user_id });
    }
    //删除用户
    static async delUser(user_id) {
        return await this.deleteOne({ user_id });
    }
    //修改密码
    static async changePwd(password) {
        this.password = password;
        this.save();
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], User.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
User = User_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], User);
exports.User = User;
//用户信息
let UserInfo = UserInfo_1 = class UserInfo {
    //查询用户信息
    static async findUserInfo(user_id) {
        return this.findOne({ user_id }, { __v: 0 });
    }
    //删除用户信息
    static async delUserInfo(user_id) {
        return this.deleteOne({ user_id });
    }
};
__decorate([
    (0, typegoose_1.prop)({ default: 'default.jpg' }),
    __metadata("design:type", String)
], UserInfo.prototype, "avatar", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "balance", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "brand_member_new", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "current_address_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "current_invoice_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "delivery_card_expire_days", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], UserInfo.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 3 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "gift_amount", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserInfo.prototype, "city", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserInfo.prototype, "registe_time", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "is_active", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_email_valid", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_mobile_valid", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], UserInfo.prototype, "mobile", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserInfo.prototype, "point", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserInfo.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({
        default: {
            game_desc: '玩游戏领红包',
            game_image_hash: '05f108ca4e0c543488799f0c7c708cb1jpeg',
            game_is_show: 1,
            game_link: 'https://gamecenter.faas.ele.me',
            gift_mall_desc: '0元好物在这里',
        }
    }),
    __metadata("design:type", Object)
], UserInfo.prototype, "column_desc", void 0);
UserInfo = UserInfo_1 = __decorate([
    (0, typegoose_1.index)({ id: 1 }),
    (0, typegoose_1.modelOptions)({ options: { allowMixed: 0, customName: 'userinfos' }, schemaOptions: { _id: false } })
], UserInfo);
//用户收货地址
let UserAddress = UserAddress_1 = class UserAddress {
    //通过id 查询用户地址
    static async findUserAddressById(id) {
        return this.findOne({ id }, { _id: 0, __v: 0 });
    }
    //通过user_id 查询用户地址
    static async findUserAddress(user_id) {
        return this.find({ user_id }, { _id: 0, __v: 0 });
    }
    //通过user_id 更新用户地址
    static async updateUserAddress(user_id, id, userAddressInfo) {
        return this.updateOne({ user_id: user_id, id: id }, userAddressInfo);
    }
    //删除用户地址
    //通过user_id 查询用户地址
    static async delUserAddress(user_id, id) {
        return this.deleteOne({ user_id, id });
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)() //用户id
    ,
    __metadata("design:type", Number)
], UserAddress.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)() //姓名
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)() //手机号
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "phone", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }) //性别
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "sex", void 0);
__decorate([
    (0, typegoose_1.prop)() //经纬度
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "st_geohash", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }) //城市name
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "city_name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }) //区名
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "area_name", void 0);
__decorate([
    (0, typegoose_1.prop)() //市级、小区、街道
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "address", void 0);
__decorate([
    (0, typegoose_1.prop)() //详细地址
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "addressDetail", void 0);
__decorate([
    (0, typegoose_1.prop)() //地址名
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "address_name", void 0);
__decorate([
    (0, typegoose_1.prop)() //标签 家or公司or..
    ,
    __metadata("design:type", String)
], UserAddress.prototype, "tag", void 0);
__decorate([
    (0, typegoose_1.prop)() //标签类型
    ,
    __metadata("design:type", Number)
], UserAddress.prototype, "tag_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }) //是否绑定手机
    ,
    __metadata("design:type", Boolean)
], UserAddress.prototype, "phone_had_bound", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }) //是否有效
    ,
    __metadata("design:type", Number)
], UserAddress.prototype, "is_valid", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }) //创建时间
    ,
    __metadata("design:type", Date)
], UserAddress.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }) //是否默认
    ,
    __metadata("design:type", Boolean)
], UserAddress.prototype, "is_user_default", void 0);
UserAddress = UserAddress_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'addresses' } })
], UserAddress);
exports.UserAddress = UserAddress;
const UserModel = (0, typegoose_1.getModelForClass)(User);
exports.UserModel = UserModel;
const UserInfoModel = (0, typegoose_1.getModelForClass)(UserInfo);
exports.UserInfoModel = UserInfoModel;
const UserAddressModel = (0, typegoose_1.getModelForClass)(UserAddress);
exports.UserAddressModel = UserAddressModel;
//# sourceMappingURL=user.js.map