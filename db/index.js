const mongoose = require('mongoose');
const config = require('config')

const connect = async () => {
    await mongoose.connect(
        config.get('db.uri'),
        config.get('db.options')
    )
}

mongoose.connection.on('disconnected', (event) => {
    console.error(event)
    console.error('Database disconection')
})

module.exports= {
    connect
}