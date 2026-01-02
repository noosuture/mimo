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

        const processNode = (jsonNode) => {
            if (jsonNode && (jsonNode.roles !== undefined || jsonNode.privyUserId)) {
                jsonNode.roles = ["EarlyAccess"];
                return true;
            }
            return false;
        };

        if (Array.isArray(jsonObj)) {
            jsonObj.forEach((item) => {
                if (item.result && item.result.data && item.result.data.json) {
                    if (processNode(item.result.data.json)) {
                        isModified = true;
                    }
                }
            });
        } else if (jsonObj.result && jsonObj.result.data && jsonObj.result.data.json) {
            if (processNode(jsonObj.result.data.json)) {
                isModified = true;
            }
        }

        if (isModified) {
            Euphoria.body = JSON.stringify(jsonObj);
        }
    }
} catch (e) {}

$done(Euphoria);
