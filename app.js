const express = require('express')

const app = new express()

// set port for app
var port = process.env.PORT || 8080

app.get('/', (req, res) => {
    console.log('Go to index')
    res.send('Go to index page')
})

app.listen(port, () => {
    console.log(`The app listen on port ${port}`)
})

