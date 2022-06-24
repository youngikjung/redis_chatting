// The Website model.
'use strict';

var   config   = require('../config'),
      knex     = require('../services/database');
const { async } = require('validate.js');
const { v1: uuidv1 } = require('uuid');

const STableNmOrder_history = 'wm_order_history';
const STableNmsStore = 'wm_store';
const STableNmUser = 'wm_user';
const STableNmOrder_detail = 'wm_order_detail';
const STableNmProduct = 'wm_product';
const STableNmProduct_option = 'wm_product_option';
const STableNmMerchant = 'wm_merchant';
const STableNmOrder_discount = 'wm_order_discount';
const STableNmOrder_receipt = 'wm_order_receipt';
const STableNmOrder_detail_option = 'wm_order_detail_option';
const sTableName = 'wm_order';
const sOrder_payment = 'wm_order_payment';
const sOrder_payment_pg = 'wm_order_payment_pg';
const sOrder_payment_tpay = 'wm_order_payment_tpay';
const sOrder_payment_van = 'wm_order_payment_van';
const sUser_reg_card = 'wm_user_reg_card';
const sUser_points = 'wm_user_points';
const sPush_token = 'wm_push_token';
const sEventCouponUser = 'wm_event_coupon_user';
const pStorePushToken = 'wm_push_token_pos';
const sOrderLocation = 'wm_order_location';

const {
   padString,
   getCurrentDatetime
} = require('../helpers/stringHelper');


var Order = {};

Order.chatMessageInsert = (sIndex,aIndex,qIndex,wIndex,rIndex,zIndex,gIndex) => {
   return   knex("wm_order_chat")
            .insert({ sender: sIndex, user_id: aIndex, store_id: qIndex, room_id: wIndex, store_read: 1, user_read: 1, os_version: rIndex, created_at: zIndex, message: gIndex })
            .then((result) => {
               return result;
            }).catch((err) => console.log(err));
}

Order.getUserPushToken = (sIndex) => {
   return  knex.select('token','push_token_id')
           .from("wm_push_token")
           .where({user_id : sIndex})
           .timeout(config.queryTimeout).then(function (result) {
               return result;
           })
           .catch((err) => console.log(err));
}

Order.getChatInputStoreContent = (sIndex) => {
   return  knex.select('order_chat_input_id','message','sequence')
           .from("wm_order_chat_input")
           .where({store_id : sIndex})
           .where({status : 1})
           .timeout(config.queryTimeout).then(function (result) {
               return result;
           })
           .catch((err) => console.log(err));
}

Order.getChatInputUserContent = (sIndex) => {
   return  knex.select('order_chat_input_id','message','sequence')
           .from("wm_order_chat_input")
           .where({user_id : sIndex})
           .where({status : 1})
           .timeout(config.queryTimeout).then(function (result) {
               return result;
           })
           .catch((err) => console.log(err));
}

Order.getPosPushToken = (sIndex) => {
   return  knex.select('token','unique_id','push_token_id')
           .from("wm_push_token_pos")
           .where({store_id : sIndex})
           .timeout(config.queryTimeout).then(function (result) {
               return result;
           })
           .catch((err) => console.log(err));
}


Order.chatMessageInfo = (storeId,orderId,userId) => {
   let sQuery = knex.raw(`
                  t1.license_number, 
                  t1.state_id,
                  t2.email, 
                  t3.store_name 
      FROM        wm_order    AS t1
      INNER JOIN  wm_user     AS t2 ON t1.user_id = t2.user_id
      INNER JOIN  wm_store    AS t3 ON t3.store_id = t1.store_id 
      WHERE       t1.order_id = ?
      AND         t1.user_id = ?
      AND         t1.store_id = ?
   `, [orderId,userId,storeId]);
   
   let oQuery = knex.select(sQuery);
   return oQuery.then((result) => {
      return result;
   }).catch((err) => console.log(err));
}

Order.getChatMessage = (aIndex) => {
   return  knex.select('sender', 'message','store_read','user_read','created_at')
               .from("wm_order_chat")
               .where({ room_id : aIndex })
               .then((result) => {
                  return result;
               })
               .catch((err) => console.log(err));
}

Order.updateUserChatMessage = async (roomId) => {
   return   knex('wm_order_chat')
            .update({ user_read: 1 })
            .where({ room_id: roomId })
            .then((result) => {
               return result;
            }).catch((err) => console.log(err));
}

Order.deletePosTargetPushToken = async (roomId) => {
   return   knex('wm_push_token_pos')
            .update({ token: null })
            .where({ push_token_id: roomId })
            .then((result) => {
               return result;
            }).catch((err) => console.log(err));
}


Order.updateStoreChatMessage = async (roomId) => {
   return   knex('wm_order_chat')
            .update({ store_read: 1 })
            .where({ room_id: roomId })
            .then((result) => {
               return result;
            }).catch((err) => console.log(err));
}


module.exports = Order;