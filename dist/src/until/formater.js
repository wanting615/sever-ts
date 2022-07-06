"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderId = exports.GetDateStr = exports.useFormatTime = void 0;
function useFormatTime(fmt, date) {
    if (!date)
        return "";
    if (typeof date === "string")
        date = new Date(date);
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k in opt) {
        const ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
        }
    }
    return fmt;
}
exports.useFormatTime = useFormatTime;
/**
 * 当前时间延后几天
 * @param {*} dd 当前时间
 * @param {*} AddDayCount 延后时间
 * @returns
 */
function GetDateStr(dd, AddDayCount) {
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    const y = dd.getFullYear();
    const m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
    const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    console.log(y + "-" + m + "-" + d);
    return y + "-" + m + "-" + d;
}
exports.GetDateStr = GetDateStr;
/**
 * 生成规则 订单id + 时间戳202108091655 + userid
 * @param {*} orderId 订单id
 * @param {*} userId 用户id
 */
function createOrderId(orderId, userId) {
    const timeStr = useFormatTime("YYmmddHHMM", new Date());
    return orderId + timeStr + userId;
}
exports.createOrderId = createOrderId;
//# sourceMappingURL=formater.js.map