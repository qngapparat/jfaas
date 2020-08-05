
// TODO error msgs
// TODO error handling
function checkHTTPStatus(res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
    return res;
  } else {
    res.text().then(console.error)
    throw new Error("Calling function via HTTP failed: ", res.statusCode);
  }
}

function callAmazon(functionName, payload, amazonOptions) {
  if (amazonOptions.region == null) {
    throw new Error("options.amazon.region (string) was unspecified.")
  }
  const lambda = new (require('aws-sdk')).Lambda({ region: amazonOptions.region })
  return lambda
    .invoke({
      FunctionName: functionName,
      Payload: JSON.stringify(payload)
    })
    .promise()
    .then(p => p.Payload)
    .then(p => JSON.parse(p))
}

function callGoogle(functionName, payload, googleOptions) {
  // TODO add support for google auth token 
  const fetch = require('node-fetch')
  if (googleOptions.projectName == null) {
    throw new Error("options.google.projectName (string) was unspecified.")
  }
  if (googleOptions.region == null) {
    throw new Error("options.google.region (string) was unspecified.")
  }
  const url = `https://${googleOptions.region}-${googleOptions.projectName}.cloudfunctions.net/${functionName}`
  return fetch(url, { method: 'POST', body: JSON.stringify(payload) })
    .then(checkHTTPStatus)
    .then(res => res.json())
}


/**
 * Call a FaaS function on Amazon or Google
 * @returns {Object} What the FaaS function returned
 * @param {string} functionName The name of the Amazon/Google function. For Amazon, it can also be an `ARN` or a `partial ARN`
 * @param {Object} payload The payload that will be passed
 * @param {Object} options Should contain either the `amazon` or `google` field. `amazon` in turn a `region` field. `google` in turn a `projectName` and `region` field.
 */
function call(functionName, payload, options) {
  if(options.amazon && options.google) {
    throw new Error("Specify either 'options.amazon' or 'options.google', but not both. Cannot decide which to call.")
  }
  if (payload == null) throw new Error("Field 'payload' was unspecified, but it must be an object.")
  if (functionName == null) throw new Error("Field 'functionName' was unspecified, but it must be a string.")

  if(options.amazon) {
    return callAmazon(functionName, payload, options.amazon)
  }
  else if(options.google) {
    return callGoogle(functionName, payload, options.google)
  }
  else {
    throw new Erorr("Neither options.amazon nor options.google specified.")
  }
}


module.exports = {
  call
}
