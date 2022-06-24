'use strict';

var config = require('../../config');

const axios = require('axios').default;
const moment = require('moment-timezone');
require('moment/locale/ko');

const Order = require('../../models/order');

const {
    convertToKRW,
    mysqlDateToYMD,
    getCurrentDatetime
} = require('../../helpers/stringHelper');

const {
    oFirebaseAdminAppPos,
    oFirebaseAdminApp,
    oFirebaseAdminAppCeo
} = require('../../services/firebaseAdmin');

const userTargetPushMessage = async (oNotiMessage) => {
    const res =  await  oFirebaseAdminApp.messaging()
                        .send(oNotiMessage)
                        .then((response) => {
                            return true
                        })
                        .catch((error) => {
                            return false
                        });
}

const posTargetPushMessage = async (oNotiMessage) => {
    const res =  await  oFirebaseAdminAppPos.messaging()
                        .send(oNotiMessage)
                        .then((response) => {
                            return true
                        })
                        .catch((error) => {
                            return false
                        });
}

const ceoTargetPushMessage = async (oNotiMessage) => {
    const res =  await  oFirebaseAdminAppCeo.messaging()
                        .send(oNotiMessage)
                        .then((response) => {
                            return true
                        })
                        .catch((error) => {
                            return false
                        });
}

const insertMessage = async (sIndex,aIndex,qIndex,wIndex,rIndex,zIndex,vIndex,bIndex,mIndex) => {
    const orderId = sIndex;
    const userId = aIndex;
    const storeId = qIndex;
    const message = wIndex;
    const date = rIndex;
    const room = zIndex;
    const owner = vIndex;
    
    let getPushToken = [];
    let oNotiMessage = {
        data: {
            title: "",
            body: message
        },
        notification: {
            title: "",
            body: message
        },
        android: {
            priority: "high",
            ttl: 3600 * 1000,
            notification: {
                channelId: "throo_app_alarm"
            },
        },
    };

    await Order.chatMessageInsert(owner,userId,storeId,room,bIndex,date,message);
    if(owner === "customer"){
        oNotiMessage.data.title = "고객님으로부터 새로운 메시지가 도착하였습니다";
        oNotiMessage.notification.title = "고객님으로부터 새로운 메시지가 도착하였습니다";
        getPushToken = await Order.getPosPushToken(parseInt(storeId));
    } else {
        oNotiMessage.data.title = "매장에서 새로운 메시지가 도착하였습니다";
        oNotiMessage.notification.title = "매장에서 새로운 메시지가 도착하였습니다";
        getPushToken = await Order.getUserPushToken(parseInt(userId));
    }
    console.log("getPushToken",getPushToken);
    
    if(getPushToken.length > 0){
        for await (const e of getPushToken) {
            if(e.token !== undefined && e.token !== null && e.token !== ""){
                oNotiMessage.token = e.token;
                if(owner === "customer"){
                    if(e.unique_id !== undefined && e.unique_id !== null && e.unique_id !== ""){
                        oNotiMessage.android.notification.channelId = "throo_store_alarm"
                        await ceoTargetPushMessage(oNotiMessage);
                    } else {
                        oNotiMessage.android.notification.channelId = "throo_pos_alarm"
                        await posTargetPushMessage(oNotiMessage);
                    }
                } else {
                    await userTargetPushMessage(oNotiMessage);
                }
            }
        }
    }

}

const insertMessageStore = () => {

}

module.exports = {
    insertMessage,
    insertMessageStore,
}