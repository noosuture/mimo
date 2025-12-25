/*************************************
Version：1.01
Update date：2025-12-25
Project: EasyGTO

[rewrite_local]
^https:\/\/applet\.easygto\.cn\/(GTO\/validateGtoResource|user\/getUserInfo) url script-response-body https://raw.githubusercontent.com/noosuture/mimo/main/Qx/yyyyy.js

[mitm]
hostname = applet.easygto.cn

*************************************/

const EasyGTO = {};
const EasyBody = JSON.parse(typeof $response != "undefined" && $response.body || null);
const url = $request.url;

const vipList = [
  { "singleType": "1", "singleName": "常规桌", "vipType": "2", "vipName": "常规桌·SVIP", "vipEndTime": "2028-12-11" },
  { "singleType": "2", "singleName": "锦标赛", "vipType": "2", "vipName": "锦标赛·SVIP", "vipEndTime": "2028-12-11" },
  { "singleType": "3", "singleName": "短牌", "vipType": "2", "vipName": "短牌·SVIP", "vipEndTime": "2028-12-11" }
];

try {
  let matchTarget = url;

  if (EasyBody) {
    if (url.indexOf('validateGtoResource') != -1) {
      matchTarget = "validateGtoResource";
      EasyBody.status = 200;
      EasyBody.code = 200;
    } 
    else if (url.indexOf('getUserInfo') != -1) {
      matchTarget = "getUserInfo";
      
      EasyBody.status = 200;
      EasyBody.code = 200;
      
      if (EasyBody.data) {
        //EasyBody.data.integral = 402856.4; 
        EasyBody.data.vipInfoList = vipList;
        EasyBody.data.vipType = "2"; 
      }
    }

    EasyGTO.body = JSON.stringify(EasyBody);
    console.log(`\n「Noosuture」成了成了🀄 匹配对象: \n ${matchTarget}\n`);
  }

} catch(e) {
  console.log(`\n「Noosuture」不中不中❓️ 匹配对象: \n ${url}\n 错误输出:`+ e.message);
}

$done(EasyGTO);
