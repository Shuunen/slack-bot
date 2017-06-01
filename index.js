/*
███████╗██╗      █████╗  ██████╗██╗  ██╗     ███╗   ███╗███████╗
██╔════╝██║     ██╔══██╗██╔════╝██║ ██╔╝     ████╗ ████║██╔════╝
███████╗██║     ███████║██║     █████╔╝█████╗██╔████╔██║█████╗  
╚════██║██║     ██╔══██║██║     ██╔═██╗╚════╝██║╚██╔╝██║██╔══╝  
███████║███████╗██║  ██║╚██████╗██║  ██╗     ██║ ╚═╝ ██║███████╗
╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═╝     ╚═╝╚══════╝
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