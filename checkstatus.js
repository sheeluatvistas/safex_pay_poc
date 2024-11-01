const axios = require('axios');
const CryptoJS = require('crypto-js');

const baseURL = 'https://uatcheckout.safexpay.ae/ms-transaction-core-1-0/transactionStatusRedirection/defaultTransactionStatus';


const merchantEncryptionKey = 'm0BK5EtM1W8QTldL6cjEEH7Ljr7zLUs+j8xZU2Nr/OY=';

const requestData = {
    "me_id": "202402140001",
    "ag_id": "paygate",
    "order_no": encrypt("34rfswf7kllllfr0i0uf0j", merchantEncryptionKey)
}

receivePaymentLinkResponse(requestData)
    .then((response) => {
        // console.log(response, "status response");
        const decryptedData = decrypt(response, merchantEncryptionKey)
        console.log('Received status response:', decryptedData);
    })
    .catch((error) => {
        console.error('Error receiving status response:', error);
    });

function encrypt(text, skey) {
    var base64Iv = "0123456789abcdef";
    var key = CryptoJS.enc.Base64.parse(skey);
    var iv = CryptoJS.enc.Utf8.parse(base64Iv);
    var encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    var decryptedData = encrypted.toString();
    return decryptedData;
}

function decrypt(text, skey) {
    var base64Iv = "0123456789abcdef";
    var key = CryptoJS.enc.Base64.parse(skey);
    var iv = CryptoJS.enc.Utf8.parse(base64Iv);
    var decrypted = CryptoJS.AES.decrypt(text, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var decryptedData = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedData;
}

async function receivePaymentLinkResponse(encryptedRequest) {
    try {
        const response = await axios.post(
            `${baseURL}`,
            {
                ...encryptedRequest
            },
            {
                headers: {
                    me_id: '202402140001',
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error receiving payment link response:', error.response.data);
        throw error;
    }
}
