const express = require('express')
const app = new express()

const PORT = process.env.PORT || 8080
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || '5d3d77b3-85f7-4d9b-8873-367b10f0b1f3'
const ONESIGNAL_APP_KEY = process.env.ONESIGNAL_APP_KEY || 'ZjRmYzA3MzAtN2UwZS00YzQxLTkzZDQtMTI5MTM3ZTMwODQ5'
const API_KEY = process.env.API_KEY || '5FBLjhLshcxTlDCxNFdPoDnFl2NiB6Tu'

const drinkEmoticons = [
    "(。・・)_且",
    "(＃´ー´)旦",
    "(。・・)_且",
    "(*^◇^)_旦",
    "ｏ口(・∀・ )",
    "且_(・_・ )",
    "ｰ( ￣▽)_皿~~",
    "(*´ｪ｀*)っ旦~",
]

// Set assets public dir
app.use(express.static(__dirname + '/public'))

app.listen(PORT, () => {
    console.log(`The app listen on port ${PORT}`)
})

app.get('/send-push', (req, res) => {
    console.log('Call api send push notification', req.headers)
    // Check api_key on header request
    let apiKey = req.headers['api_key']
    console.log('api key: ' + apiKey)
    if (apiKey === API_KEY) {
        console.log('Request valid, App will send push notification to all subscribe')
        sendNotification()
        res.send('Sending Notification')
    } else {
        console.log('Request invalid, api_key missing or wrong', apiKey)
        res.send('Invalid api_key')
    }
})

/**
 * Call API onesignal for send notification
 * @param {*} data 
 */
function sendNotification() {
    console.log('Send notification ' + + new Date())
    let headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${ONESIGNAL_APP_KEY}`
    }

    let options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    }

    let emotion = drinkEmoticons[Math.floor(Math.random()*drinkEmoticons.length)]
    let message = {
        app_id: `${ONESIGNAL_APP_ID}`,
        contents: {
            "en": `Uống nước nào bạn ${emotion}`
        },
        chrome_web_image: "http://oi63.tinypic.com/346amvs.jpg",
        included_segments: ["All"],
        ttl: 1800, /* Time To Live - In seconds. The notification will be expired if the device does not come back online within this time. */
    }

    let https = require('https')
    let req = https.request(options, function (res) {
        res.on('data', function (message) {
            console.log("Response:")
            console.log(JSON.parse(message))
        })
    })

    req.on('error', function (e) {
        console.log("ERROR:")
        console.log(e)
    })

    req.write(JSON.stringify(message))
    req.end()
}