/*************************************
Project: Euphoria Testnet Bypass


[rewrite_local]
^https:\/\/api\.testnet\.euphoria\.finance\/.*(users\.getProfile|batch=1).* url script-response-body https://raw.githubusercontent.com/noosuture/mimo/main/Qx/Euphoria.js

[mitm]
hostname = api.testnet.euphoria.finance
*************************************/

const Euphoria = {};
const bodyStr = typeof $response != "undefined" && $response.body || null;

try {
    if (bodyStr) {
        let jsonObj = JSON.parse(bodyStr);
        let isModified = false;

        // --- 通用处理函数 ---
        const processNode = (jsonNode) => {
            let modified = false;

            // 1. 功能模块：权限解锁 (针对 users.getProfile)
            // 特征：包含 roles 字段
            if (jsonNode && (jsonNode.roles !== undefined || jsonNode.privyUserId)) {
                // 强制注入 EarlyAccess
                jsonNode.roles = ["EarlyAccess"];
                // 顺手改大积分
                if (jsonNode.credits) jsonNode.credits.amount = 999999;
                if (jsonNode.percentile) jsonNode.percentile = 0.01;
                modified = true;
            }

            // 2. 功能模块：交易余额修改 (针对 trades.execute)
            // 特征：包含 remainingBalance 字段
            if (jsonNode && jsonNode.remainingBalance !== undefined) {
                // 修改显示余额
                jsonNode.remainingBalance = 999999999999999999;
                // 修改 Wei 单位余额 (防止前端计算不一致)
                if (jsonNode.remainingBalanceWei) {
                    jsonNode.remainingBalanceWei = "999999999999999999000000000000000000";
                }
                // 确保交易标记为成功
                jsonNode.success = true;
                jsonNode.rejected = false;
                
                modified = true;
                console.log(`   └─ 💰 余额已修改为无限`);
            }

            return modified;
        };

        // --- 遍历逻辑 (支持 Batch 和 Single) ---
        if (Array.isArray(jsonObj)) {
            // 批量响应模式
            jsonObj.forEach((item, index) => {
                if (item.result && item.result.data && item.result.data.json) {
                    if (processNode(item.result.data.json)) {
                        isModified = true;
                    }
                }
            });
        } else if (jsonObj.result && jsonObj.result.data && jsonObj.result.data.json) {
            // 单一响应模式
            if (processNode(jsonObj.result.data.json)) {
                isModified = true;
            }
        }

        if (isModified) {
            Euphoria.body = JSON.stringify(jsonObj);
            console.log(`\n「Euphoria」成了成了🀄 数据修改成功 (权限/余额)\n`);
        } else {
            // console.log(`\n「Euphoria」无需修改\n`);
        }
    }
} catch (e) {
    console.log(`\n「Euphoria」不中不中❓️ 脚本错误: ${e.message}\n`);
}

$done(Euphoria);
$done(Euphoria);
