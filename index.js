const axios = require('axios');
const CryptoJS = require('crypto-js');
const { HmacSHA256 } = require('crypto-js');
const {SHA512} = require('crypto-js');
 
const baseURL = 'https://uatportal.safexpay.ae/sdk/';
const endpoint = 'paymentByLinkResponse';
 
const merchantEncryptionKey = 'm0BK5EtM1W8QTldL6cjEEH7Ljr7zLUs+j8xZU2Nr/OY=';
 
const requestData = {
    "req_user_id": "xyzab145",
    "me_id": "202402140001",
    "amount": "500",
    "customer_email": "shahkaidea@safexpay.com",
    "mobile_no": "9004644947",
    "expiry_date": "2024-11-05",
    "media_type": "API",
    "order_id": "34rfswf7kllllfr0i0uf0j",
    "first_name": "Azam",
    "last_name": "Shah",
    "reminder1": "",
    "product": "product12321",
    "dial_code": "+91",
    "reminder2": "",
    "country": "ARE",
    "currency": "AED",
    "success_url": "https://medisense.health/payment_success.php",
    "failure_url": "https://medisense.health/payment_failure.php"
  }
 
const encryptedRequest = encrypt(JSON.stringify(requestData), merchantEncryptionKey);
 
receivePaymentLinkResponse(encryptedRequest)
    .then((response) => {
        // console.log(response,"payment link response");
    const decryptedData = decrypt(response,merchantEncryptionKey)
        console.log('Received payment link response:', decryptedData);
    })
    .catch((error) => {
        console.error('Error receiving payment link response:', error);
    });
 
function encode(text, skey) {
    var base64Iv = "0123456789abcdef";  
    var key = CryptoJS.enc.Base64.parse(skey);
    var iv = CryptoJS.enc.Utf8.parse(base64Iv);
    var encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var decryptedData = encrypted.toString();
    return decryptedData;
}
 
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
            `${baseURL}${endpoint}`,
            {
                request: encryptedRequest
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
 