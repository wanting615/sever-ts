export function useFormatTime(fmt: string, date: string | Date): string {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  const opt: { [k in string]: string } = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
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

/**
 * 当前时间延后几天
 * @param {*} dd 当前时间
 * @param {*} AddDayCount 延后时间 
 * @returns 
 */
export function GetDateStr(dd: Date, AddDayCount: number): string {
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  const y = dd.getFullYear();
  const m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
  const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
  console.log(y + "-" + m + "-" + d);
  return y + "-" + m + "-" + d;
}

/**
 * 生成规则 订单id + 时间戳202108091655 + userid
 * @param {*} orderId 订单id 
 * @param {*} userId 用户id
 */
export function createOrderId(orderId: number, userId: number): string {
  const timeStr = useFormatTime("YYmmddHHMM", new Date());
  return orderId + timeStr + userId;
}