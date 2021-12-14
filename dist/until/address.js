"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch");
/*
腾讯地图和百度地图API统一调配组件
 */
class Address {
    constructor() {
        this.tencentkey = "L3ABZ-H4P62-PMCUD-CBG5F-LXTX7-XGF5E";
    }
    async fetch(url = "", data = {}, type = "GET", resType = "JSON") {
        type = type.toUpperCase();
        resType = resType.toUpperCase();
        if (type == "GET") {
            let dataStr = ""; //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + "=" + data[key] + "&";
            });
            if (dataStr !== "") {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
                url = url + "?" + dataStr;
            }
        }
        const requestConfig = {
            method: type,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        };
        if (type == "POST") {
            Object.defineProperty(requestConfig, "body", {
                value: JSON.stringify(data)
            });
        }
        let responseJson;
        try {
            const response = await fetch(url, requestConfig);
            if (resType === "TEXT") {
                responseJson = await response.text();
            }
            else {
                responseJson = await response.json();
            }
        }
        catch (err) {
            console.log("获取http数据失败", err);
            throw new Error(err);
        }
        return responseJson;
    }
    //ip获取定位地址
    async guessPosition(req) {
        return new Promise(async (resolve, reject) => {
            let ip;
            const defaultIp = "180.167.225.236";
            if (process.env.NODE_ENV == "development") {
                ip = defaultIp;
            }
            else {
                try {
                    ip = req.headers["x-forwarded-for"] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.connection.socket.remoteAddress;
                    const ipArr = ip.split(":");
                    ip = ipArr[ipArr.length - 1] || defaultIp;
                }
                catch (e) {
                    ip = defaultIp;
                }
            }
            try {
                const result = await this.fetch("http://apis.map.qq.com/ws/location/v1/ip", {
                    ip,
                    key: this.tencentkey,
                });
                if (result.status == 0) {
                    const cityInfo = {
                        lat: result.result.location.lat,
                        lng: result.result.location.lng,
                        city: result.result.ad_info.city,
                    };
                    cityInfo.city = cityInfo.city.replace(/市$/, "");
                    resolve(cityInfo);
                }
                else {
                    // console.log('定位失败', result)
                    resolve({
                        city: "上海",
                        lat: "31.18826",
                        lng: "121.43687"
                    });
                    // reject('定位失败');
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    //搜索地址
    async searchPlace(keyword, cityName, type = "search") {
        try {
            const resObj = await this.fetch("http://apis.map.qq.com/ws/place/v1/search", {
                key: this.tencentkey,
                keyword: encodeURIComponent(keyword),
                boundary: "region(" + encodeURIComponent(cityName) + ",0)",
                page_size: 10,
            });
            if (resObj.status == 0) {
                return resObj;
            }
            else {
                throw new Error("搜索位置信息失败");
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }
    //测量距离
    async getDistance(from, to, type) {
        try {
            const res = await this.fetch("https://apis.map.qq.com/ws/distance/v1/", {
                mode: "driving",
                from: from,
                to: to,
                key: this.tencentkey,
                output: "json",
            });
            if (res.status == 0) {
                const positionArr = [];
                let timevalue;
                res.result.elements.forEach((item) => {
                    timevalue = parseInt(item.duration) + 1200;
                    let durationtime = Math.ceil(timevalue % 3600 / 60) + "分钟";
                    if (Math.floor(timevalue / 3600)) {
                        durationtime = Math.floor(timevalue / 3600) + "小时" + durationtime;
                    }
                    let distance = "0";
                    if (item.distance > 999) {
                        distance = (item.distance / 1000).toFixed(2) + "km";
                    }
                    else {
                        distance = item.distance + "m";
                    }
                    positionArr.push({
                        distance: distance,
                        order_lead_time: durationtime,
                    });
                });
                if (type == "tiemvalue") {
                    return timevalue;
                }
                else {
                    return positionArr;
                }
            }
            else {
                if (type == "tiemvalue") {
                    return 2000;
                }
                else {
                    throw new Error("调用qq地图测距失败");
                }
            }
        }
        catch (err) {
            console.log("获取位置距离失败");
            throw new Error(err);
        }
    }
    async getDistanceTime(from, to) {
        try {
            const res = await this.fetch("https://apis.map.qq.com/ws/distance/v1/", {
                mode: "driving",
                from: from,
                to: to,
                key: this.tencentkey,
                output: "json",
            });
            if (res.status == 0) {
                const positionArr = [];
                let timevalue;
                res.result.elements.forEach((item) => {
                    timevalue = parseInt(item.duration) + 1200;
                    let distance = "0";
                    if (item.distance > 999) {
                        distance = (item.distance / 1000).toFixed(2) + "km";
                    }
                    else {
                        distance = item.distance + "m";
                    }
                    positionArr.push({
                        distance: distance,
                        order_lead_time: timevalue,
                    });
                });
                return positionArr;
            }
            else {
                throw new Error("调用qq地图测距失败");
            }
        }
        catch (err) {
            console.log("获取位置距离失败");
            throw new Error(err);
        }
    }
    //通过经纬度地址获取精确位置
    async geocoder(req) {
        try {
            const address = await this.guessPosition(req);
            const params = {
                key: this.tencentkey,
                location: address.lat + "," + address.lng
            };
            const res = await this.fetch("http://apis.map.qq.com/ws/geocoder/v1/", params);
            if (res.status == 0) {
                return res;
            }
            else {
                throw new Error("获取具体位置信息失败");
            }
        }
        catch (err) {
            console.log("geocoder获取定位失败", err);
            throw new Error(err);
        }
    }
    //通过geohash获取精确位置
    async getpois(lat, lng) {
        try {
            const params = {
                key: this.tencentkey,
                location: lat + "," + lng
            };
            const res = await this.fetch("http://apis.map.qq.com/ws/geocoder/v1/", params);
            if (res.status == 0) {
                return res;
            }
            else {
                throw new Error("通过获geohash取具体位置失败");
            }
        }
        catch (err) {
            console.log("getpois获取定位失败", err);
            throw new Error(err);
        }
    }
}
exports.default = new Address();
//# sourceMappingURL=address.js.map