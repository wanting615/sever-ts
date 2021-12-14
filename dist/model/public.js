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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategories = exports.Support = exports.PiecewiseAgentFee = exports.License = exports.Identification = exports.DeliveryMode = exports.Activity = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Activity = class Activity {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Activity.prototype, "icon_color", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Activity.prototype, "icon_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Activity.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "ranking_weight", void 0);
Activity = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], Activity);
exports.Activity = Activity;
let DeliveryMode = class DeliveryMode {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], DeliveryMode.prototype, "color", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], DeliveryMode.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Boolean)
], DeliveryMode.prototype, "is_solid", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], DeliveryMode.prototype, "text", void 0);
DeliveryMode = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], DeliveryMode);
exports.DeliveryMode = DeliveryMode;
let Identification = class Identification {
};
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "company_name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Identification.prototype, "identificate_date", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "legal_person", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "licenses_date", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "licenses_number", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "licenses_scope", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "operation_period", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "registered_address", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Identification.prototype, "registered_number", void 0);
Identification = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], Identification);
exports.Identification = Identification;
let License = class License {
};
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], License.prototype, "business_license_image", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], License.prototype, "catering_service_license_image", void 0);
License = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], License);
exports.License = License;
let PiecewiseAgentFee = class PiecewiseAgentFee {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], PiecewiseAgentFee.prototype, "tips", void 0);
PiecewiseAgentFee = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], PiecewiseAgentFee);
exports.PiecewiseAgentFee = PiecewiseAgentFee;
let Support = class Support {
    constructor(opts) {
        if (opts) {
            Object.assign(this, opts);
        }
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Support.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Support.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Support.prototype, "icon_color", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Support.prototype, "icon_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Support.prototype, "name", void 0);
Support = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } }),
    __metadata("design:paramtypes", [Object])
], Support);
exports.Support = Support;
let SubCategories = class SubCategories {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], SubCategories.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], SubCategories.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], SubCategories.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], SubCategories.prototype, "image_url", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], SubCategories.prototype, "name", void 0);
SubCategories = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], SubCategories);
exports.SubCategories = SubCategories;
//# sourceMappingURL=public.js.map