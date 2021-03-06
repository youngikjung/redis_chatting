'use strict'

const oCurrency = require('currency.js');
const moment = require('moment-timezone');
require('moment/locale/ko');

const mysqlDateToYMD = (sDateTime, bYmdOnly, sDelimiter, bIncludeTime) => {

   var t, result = null;
   var sDelim = '-';
   if (sDelimiter != undefined && sDelimiter.length > 0) {
      sDelim = sDelimiter;
   }

   if (typeof sDateTime === 'string') {
      t = sDateTime.split(/[- :]/);

      if (t.length > 0 && t[0].trim().length == 14) {
         let sParseDatetime = t[0].trim();
         let sYear = sParseDatetime.substr(0, 4);
         let sMonth = sParseDatetime.substr(4, 2);
         let sDay = sParseDatetime.substr(6, 2);
         let sHour = sParseDatetime.substr(8, 2);
         let sMinute = sParseDatetime.substr(10, 2);
         let sSecond = sParseDatetime.substr(12, 2);
         let sReturn = sYear + '-' + sMonth + '-' + sDay + ' ' + sHour + ':' + sMinute + ':' + sSecond;
         return sReturn;
      }

      if (t.length > 0 && t[0].trim().length == 12) {
         let sYY = new Date().getFullYear().toString().substring(0, 2);
         let sParseDatetime = t[0].trim();
         let sYear = sYY + sParseDatetime.substr(0, 2);
         let sMonth = sParseDatetime.substr(2, 2);
         let sDay = sParseDatetime.substr(4, 2);
         let sHour = sParseDatetime.substr(6, 2);
         let sMinute = sParseDatetime.substr(8, 2);
         let sSecond = sParseDatetime.substr(10, 2);
         let sReturn = sYear + '-' + sMonth + '-' + sDay + ' ' + sHour + ':' + sMinute + ':' + sSecond;
         return sReturn;
      }

      //when t[3], t[4] and t[5] are missing they defaults to zero
      if (sDateTime.indexOf('T') == -1) {
         result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);

         if (bYmdOnly != undefined && bYmdOnly == true) {
            if (sDateTime != null && sDateTime.indexOf('T') != -1) {
               result = sDateTime.substr(0, 10);
            } else if (t.length > 1) {
               result = new Date(t[0], t[1] - 1, t[2]);
            }
         }
      }
   } else if (typeof sDateTime === 'object') {
      var d = new Date(sDateTime),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

      if (month.length < 2) {
         month = '0' + month;
      }
      if (day.length < 2) {
         day = '0' + day;
      }
      if (bIncludeTime != undefined && bIncludeTime == true) {
         var sSeconds = ('0' + d.getSeconds()).slice(-2);
         var sMinutes = ('0' + d.getMinutes()).slice(-2);
         var sHour = ('0' + d.getHours()).slice(-2);
         let sTime = ' ' + sHour + ':' + sMinutes + ':' + sSeconds;
         return [year, month, day].join(sDelim) + sTime;
      }
      return [year, month, day].join(sDelim);
   }

   return result;
}

const convertToKRW = (iPrice, bWithSymbol) => {
   let sSymbol = '';
   if (bWithSymbol != undefined && bWithSymbol == true) {
      sSymbol = '???';
   }
   const KRW = value => oCurrency(value, { symbol: sSymbol, precision: 0 });
   return KRW(iPrice).format(true);
}

const getCurrentDatetime = (secondYn) => {
   let sFormat;

   /*
   let addZero = function (x, n) {
   while (x.toString().length < n) {
   x = "0" + x;
   }
   return x;
   }

   let d = new Date();

   let month = ('0' + (d.getMonth() + 1)).slice(-2);
   let day = ('0' + d.getDate()).slice(-2);
   let year = d.getFullYear();

   let h = addZero(d.getHours(), 2);
   let m = addZero(d.getMinutes(), 2);
   let s = addZero(d.getSeconds(), 2);
   let ms = addZero(d.getMilliseconds(), 4);
   */
   let d = new Date();

   if (secondYn != undefined && secondYn == 'nodivider') {
      //sFormat = year + '' + month + '' + day + "" + h + "" + m + "" + s + "" + ms;
      sFormat = moment(d).tz('Asia/Seoul').format('YYYYMMDDHHmmssSSS');
      console.log(sFormat);
      return sFormat;
   }

   if (secondYn) {
      //sFormat = year + '' + month + '' + day + "-" + h + "" + m + "" + s;
      sFormat = moment(d).tz('Asia/Seoul').format('YYYYMMDD-HHmmss');
   } else {
      //sFormat = year + '' + month + '' + day + "-" + h + "" + m + "" + s + "-" + ms;
      sFormat = moment(d).tz('Asia/Seoul').format('YYYYMMDD-HHmmss-SSS');
   }
   console.log(sFormat);
   return sFormat;
}

const getClientIP = (oReq) => {
   let sIp = oReq.headers['x-forwarded-for'] || oReq.connection.remoteAddress;
   if (sIp.length > 6 && sIp.substr(0, 7) == "::ffff:") {
      sIp = sIp.substr(7);
   }
   return sIp;
}

const IsJsonString = (sStr) => {
   try {
      JSON.parse(sStr);
   } catch (e) {
      return false;
   }
   return true;
}


module.exports = {
   mysqlDateToYMD,
   convertToKRW,
   getCurrentDatetime,
   getClientIP,
   IsJsonString,
}