/*************************************
Project: Euphoria Testnet Bypass


[rewrite_local]
^https:\/\/api\.testnet\.euphoria\.finance\/.*(users\.getProfile|batch=1).* url script-response-body https://raw.githubusercontent.com/noosuture/mimo/main/Qx/Euphoria.js

[mitm]
hostname = api.testnet.euphoria.finance
*************************************/

const Euphoria = {};
const bodyStr = typeof $response != "undefined" && $response.body || null;
const url = $request.url;

try {
    if (bodyStr) {
        let jsonObj = JSON.parse(bodyStr);
        let isModified = false;

        // 定义修改逻辑：寻找用户数据并注入权限
        const injectEarlyAccess = (jsonNode) => {
            // 判断特征：必须包含 roles 字段 (哪怕是空数组)，或者包含 username/id
            if (jsonNode && (jsonNode.roles !== undefined || jsonNode.username || jsonNode.privyUserId)) {
                
                // 核心修改：源码逻辑要求必须是 "EarlyAccess"
                jsonNode.roles = ["EarlyAccess"]; 
                
                // 额外修改：改个积分玩玩
                if (jsonNode.credits) {
                    jsonNode.credits.amount = 999999;
                }
                // 修改排名百分比 (越小越好)
                if (jsonNode.percentile) {
                    jsonNode.percentile = 0.01;
                }
                
                return true;
            }
            return false;
        };

        // 处理 TRPC 的两种响应格式
        if (Array.isArray(jsonObj)) {
            // 1. 批量响应模式 (Batch Mode) - 对应 URL 中的 batch=1
            console.log(`\n「Euphoria」检测到批量响应 (Batch Response)`);
            jsonObj.forEach((item, index) => {
                if (item.result && item.result.data && item.result.data.json) {
                    if (injectEarlyAccess(item.result.data.json)) {
                        isModified = true;
                        console.log(`   └─ 成功修改第 ${index} 个数据块 (用户信息)`);
                    }
                }
            });
        } else if (jsonObj.result && jsonObj.result.data && jsonObj.result.data.json) {
            // 2. 单一响应模式 (Single Mode)
            console.log(`\n「Euphoria」检测到单一响应 (Single Response)`);
            if (injectEarlyAccess(jsonObj.result.data.json)) {
                isModified = true;
            }
        }

        if (isModified) {
            Euphoria.body = JSON.stringify(jsonObj);
            console.log(`\n「Euphoria」成了成了🀄 权限(EarlyAccess)注入成功\n`);
        } else {
            console.log(`\n「Euphoria」未找到用户信息节点，跳过修改\n`);
        }
    }
} catch (e) {
    console.log(`\n「Euphoria」不中不中❓️ 脚本错误: ${e.message}\n`);
}

$done(Euphoria);
