
// TODO error msgs
// TODO add supprot for google auth token 

function checkHTTPStatus(res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
    return res;
  } else {
    res.text().then(console.error)
    throw new Error("Calling function via HTTP failed: ", res.statusCode);
  }
}

function callAmazon(functionName, payload, options) {
  if (options.region == null) throw new Error("options.region (string) was unspecified, which is needed to call Amazon functions.")
  const lambda = new (require('aws-sdk')).Lambda({ region: options.region })
  return lambda
    .invoke({
      FunctionName: functionName,
      Payload: JSON.stringify(payload)
    })
    .promise().then(p => p.Payload)
}

function callGoogle(functionName, payload, options) {
  const fetch = require('node-fetch')
  if (options.googleProjectName == null) throw new Error("options.googleProjectName (string) was unspecified, which is needed to call Google functions.")
  if (options.region == null) throw new Error("options.region (string) was unspecified, which is needed to call Google functions.")
  const url = `https://${options.region}-${options.googleProjectName}.cloudfunctions.net/${functionName}`
  return fetch(url, { method: 'POST', body: JSON.stringify(payload) })
    .then(checkHTTPStatus)
    .then(res => res.json())
}


function call(functionName, payload, options) {
  if (payload == null) throw new Error("Field options.payload was unspecified, but it must be an object.")
  return callGoogle(functionName, payload, options)
}


call('IBMTEST4', { msg: "ayy" }, { googleProjectName: 'firstnodefunc', region: 'us-central1' })
  .then(console.log)
  .catch(e => console.log(e))


module.exports = {
  call
}


curl -X POST "https://us-central1-firstnodefunc.cloudfunctions.net/IBMTEST4" -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}'
