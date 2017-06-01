/*
███████╗██╗      █████╗  ██████╗██╗  ██╗     ██████╗  ██████╗ ████████╗
██╔════╝██║     ██╔══██╗██╔════╝██║ ██╔╝     ██╔══██╗██╔═══██╗╚══██╔══╝
███████╗██║     ███████║██║     █████╔╝█████╗██████╔╝██║   ██║   ██║   
╚════██║██║     ██╔══██║██║     ██╔═██╗╚════╝██╔══██╗██║   ██║   ██║   
███████║███████╗██║  ██║╚██████╗██║  ██╗     ██████╔╝╚██████╔╝   ██║   
╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═════╝  ╚═════╝    ╚═╝  
*/

// get secret token
const fs = require('fs')
let token = fs.readFileSync('./token.conf', 'utf8')
if (!token) {
    console.log('please set a slack token in a token.conf file')
    return
}
token = token.replace('\n', '')

// create & connect the bot
const Botkit = require('botkit')
let bot = Botkit.slackbot({ debug: false })
bot.spawn({ token: token }).startRTM()

// educate the bot to our world
bot.hears('ça va', ['ambient'], function (bot, message) {
    bot.reply(message, 'Nickel et toi ?')
})
bot.hears('quelle heure', ['ambient'], function (bot, message) {
    let date = new Date()
    let time = date.getHours() + ':' + date.getMinutes()
    bot.reply(message, 'il est ' + time)
})