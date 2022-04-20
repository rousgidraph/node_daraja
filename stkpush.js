const unirest = require('unirest');
const dotenv = require('dotenv');
const { json } = require('node:stream/consumers');
const { time } = require('console');



//variables

//read constants 
dotenv.config()
//console.log(`${process.env.PartyB}`);



function  get_token(callback){

  let mix = btoa(process.env.consumer_key+":"+process.env.secret);
  let req= unirest.get(process.env.auth_endpoint).headers({"Authorization":"Basic "+mix}).query("grant_type","client_credentials").end(res => {
    if (res.error){
      throw new Error(res.error);
      callback(res.error, null)
    } else{
      let output =JSON.parse(res.raw_body)  
      console.log(output.access_token);
      callback(null, output.access_token)
    }
    
     })
 }

function stkpush( phoneNumber, ammount, TransactionDesc ){

  let timeStamp = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14);
  let shortCode = process.env.BusinessShortCode;
  let pass = process.env.skt_passkey;
  let passmix =shortCode+pass+timeStamp 
  //console.log(passmix);
  let base64 = btoa(passmix)
  //console.log(base64);
  let url = process.env.stk_endpoint;
  console.log(url);
  
  var token = get_token(function(error,res){
    if (error === null){
      var request = unirest.post(url).headers({'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+res})
      .send(JSON.stringify({
          "BusinessShortCode": shortCode,
          "Password":base64,
          "Timestamp": timeStamp,
          "TransactionType": process.env.TransactionType,
          "Amount": ammount,
          "PartyA": phoneNumber,
          "PartyB": shortCode,
          "PhoneNumber": process.env.PhoneNumber,
          "CallBackURL": process.env.CallBackURL,
          "AccountReference": process.env.AccountReference,
          "TransactionDesc": TransactionDesc 
        }))
        .end(res => {
        if (res.error) throw new Error(res.error);
        console.log(res.raw_body);
      });
    }
  })
  
}

function transactionPoller(checkoutRequestID){
  let timeStamp = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14);
  let shortCode = process.env.BusinessShortCode;
  let pass = process.env.skt_passkey;
  let passmix =shortCode+pass+timeStamp 
  //console.log(passmix);
  let base64 = btoa(passmix)
  //console.log(base64);
  let url = process.env.poll_endpoint;
  console.log(url);
  
  var token = get_token(function(error,res){
    if (error === null){
      var request = unirest.post(url).headers({'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+res})
      .send(JSON.stringify({
          "BusinessShortCode": shortCode,
          "Password":base64,
          "Timestamp": timeStamp,
          "CheckoutRequestID": checkoutRequestID
        }))
        .end(res => {
        if (res.error) throw new Error(res.error);
        console.log(res.raw_body);
      });
    }
  })
}


get_token(function(error,res){
  if(error === null){
    console.log("Got the token "+res);

  }else{
    console.log("Unable to get the token "+error);

  }
})

//stkpush(254710422647,20,"Having good music taste")

//transactionPoller("ws_CO_20042022084340424710422647")
