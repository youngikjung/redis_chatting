const Order = require('../app/models/order');
const moment = require('moment-timezone');
require('moment/locale/ko');

const tempUserContent = [
    {
        key : 0,
        content: "조금 일찍 도착할 것 같아요."
    },
    {
        key : 1,
        content: "조금 늦을 것 같아요~"
    },
    {
        key : 2,
        content: "식지않게 도착 예정 시간에 맞춰주세요~"
    },
    {
        key : 3,
        content: "픽업존을 못찾겠어요~"
    },
    {
        key : 4,
        content: "아직 준비안됐나요? 얼마나 기다려야 하나요?"
    },
];

const tempStoreContent = [
    {
        key : 0,
        content: "죄송하지만 바뻐서 준비가 5분정도 늦어질것 같습니다."
    },
    {
        key : 1,
        content: "죄송하지만 바뻐서 준비가 10분정도 늦어질것 같습니다."
    },
    {
        key : 2,
        content: "죄송하지만 주문하신 상품중에 재고가 없는 상품이 있습니다."
    },
    {
        key : 3,
        content: "고객님, 픽업존 오시는 방법은"
    },
    {
        key : 4,
        content: "고객님, 거의 준비 됐습니다. 잠시만 기다려주세요~"
    },
];

module.exports = function(app, fs)
{
    app.get('/', async (req,res) => {
        
        let oResult = {
            activate : false,
            messageList : [],
            userContentList : [],
            carNm : "",
            sEmail : "",
            storeNm : "",
            charactor : "",
            storeId : 0,
            orderId : 0,
            userId : 0,
        }
        let sParam = req.query;
        let userContent = [];
        let temp_array = [];
        let temp_list0 = {};
        let temp_list1 = {};
        let temp_list2 = {};
        let temp_list3 = {};
        let temp_list4 = {};

        try {
            if(sParam.customer === undefined || sParam.customer === null || sParam.customer === ""){
                res.status(200).render('404');
            } else if (sParam.order_id === undefined || sParam.order_id === null || sParam.order_id === "") {
                res.status(200).render('404');
            } else if (sParam.store_id === undefined || sParam.store_id === null || sParam.store_id === "") {
                res.status(200).render('404');
            } else if (sParam.user_id === undefined || sParam.user_id === null || sParam.user_id === "") {
                res.status(200).render('404');
            } else {
                oResult.charactor = sParam.customer;
                oResult.storeId = sParam.store_id;
                oResult.orderId = sParam.order_id;
                oResult.userId = sParam.user_id;
                const roomId = "throo" + oResult.orderId.toString() + oResult.userId.toString() + oResult.storeId.toString();
                const chatMessageInfo = await Order.chatMessageInfo(parseInt(oResult.storeId),parseInt(oResult.orderId),parseInt(oResult.userId));
                if(chatMessageInfo.length > 0){
                    oResult.activate = true;
                    oResult.carNm = chatMessageInfo[0].license_number;
                    oResult.sEmail = chatMessageInfo[0].email;
                    oResult.storeNm = chatMessageInfo[0].store_name;

                    const getMessage = await Order.getChatMessage(roomId);
                    if(getMessage.length > 0){
                        for await (const i of getMessage) {
                            let temp = {};
                            temp.key = i.sender;
                            temp.message = i.message;
                            temp.date = moment(i.created_at).format('LT');
                            temp.isStoreRead = i.store_read;
                            temp.isUserRead = i.user_read;
                            oResult.messageList.push(temp);
                        }
                        if(oResult.charactor === "customer"){
                            await Order.updateUserChatMessage(roomId);
                        } else {
                            await Order.updateStoreChatMessage(roomId);
                        }
                    }
                    oResult.messageList = JSON.stringify(oResult.messageList);
                    
                    if(oResult.charactor === "customer"){
                        userContent = await Order.getChatInputUserContent(parseInt(sParam.user_id));
                    } else {
                        userContent = await Order.getChatInputStoreContent(parseInt(sParam.store_id));
                    }
                    if(userContent.length > 0){
                        if(oResult.charactor === "customer"){
                            temp_array = [
                                {
                                    key : 0,
                                    content: "조금 일찍 도착할 것 같아요."
                                },
                                {
                                    key : 1,
                                    content: "조금 늦을 것 같아요~"
                                },
                            ];
                            console.log("temp_array ====0",temp_array);
                        } else {
                            temp_array = [
                                {
                                    key : 0,
                                    content: "죄송하지만 바뻐서 준비가 10분정도 늦어질것 같습니다."
                                },
                                {
                                    key : 1,
                                    content: "죄송하지만 주문하신 상품중에 재고가 없는 상품이 있습니다."
                                },
                            ];
                            console.log("temp_array ====0",temp_array);
                        }
                        for await (const i of userContent) {
                            if(i.sequence.toString() === "0"){
                                console.log("temp_array0",temp_array[0]);
                                temp_list0.key = i.sequence;
                                temp_list0.content = i.message;
                                temp_array[0] = temp_list0;
                                console.log("temp_array0",temp_array[0]);
                            } else if (i.sequence.toString() === "1"){
                                console.log("temp_array1",temp_array[1]);
                                temp_list1.key = i.sequence;
                                temp_list1.content = i.message;
                                temp_array[1] = temp_list1;
                                console.log("temp_array1",temp_array[1]);
                            }
                        }
                        console.log("temp_array",temp_array);
                        oResult.userContentList = temp_array;
                    } else {
                        if(oResult.charactor === "customer"){
                            oResult.userContentList = [
                                {
                                    key : 0,
                                    content: "조금 일찍 도착할 것 같아요."
                                },
                                {
                                    key : 1,
                                    content: "조금 늦을 것 같아요~"
                                },
                            ];
                        } else {
                            oResult.userContentList = [
                                {
                                    key : 0,
                                    content: "죄송하지만 바뻐서 준비가 10분정도 늦어질것 같습니다."
                                },
                                {
                                    key : 1,
                                    content: "죄송하지만 주문하신 상품중에 재고가 없는 상품이 있습니다."
                                },
                            ];
                        }
                    }
                    oResult.userContentList = JSON.stringify(oResult.userContentList);
                    console.log("oResult",oResult);
                    if(chatMessageInfo[0].state_id.toString() === "14004" || chatMessageInfo[0].state_id.toString() === "14005" || chatMessageInfo[0].state_id.toString() === "16001" || chatMessageInfo[0].state_id.toString() === "17001" || chatMessageInfo[0].state_id.toString() === "18001" || chatMessageInfo[0].state_id.toString() === "15002"){
                        res.status(200).render('done', oResult);
                    } else {
                        res.status(200).render('index', oResult);
                    }

                } else {
                    res.status(200).render('404');
                }
            }
        } catch (error) {
            console.log("get chat Message fail! ====>> error:",error);

            res.status(200).render('404');
        }
    });

    app.get('/authResult', async (req,res) => {
        console.log("authResult");
        console.log("req.query",req.query);
        const authCode = req.query.code;
        console.log("authCode",authCode);
        request(option, function (error, response, body) {
            console.log("body",body);
            var requestResultJSON = JSON.parse(body);
            res.render('resultChild',{data : requestResultJSON})
        });
    });
}