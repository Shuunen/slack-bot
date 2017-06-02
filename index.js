/*
███████╗██╗      █████╗  ██████╗██╗  ██╗     ██████╗  ██████╗ ████████╗
██╔════╝██║     ██╔══██╗██╔════╝██║ ██╔╝     ██╔══██╗██╔═══██╗╚══██╔══╝
███████╗██║     ███████║██║     █████╔╝█████╗██████╔╝██║   ██║   ██║   
╚════██║██║     ██╔══██║██║     ██╔═██╗╚════╝██╔══██╗██║   ██║   ██║   
███████║███████╗██║  ██║╚██████╗██║  ██╗     ██████╔╝╚██████╔╝   ██║   
╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═════╝  ╚═════╝    ╚═╝  
*/

// basic mods
const fetch = require('node-fetch')

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

/* ___  __        __       ___    __       
  |__  |  \ |  | /  `  /\   |  | /  \ |\ | 
  |___ |__/ \__/ \__, /~~\  |  | \__/ | \|  */
/*
  Hello
*/
bot.hears('ça va', ['ambient'], (bot, message) => {
    bot.reply(message, 'Nickel et toi ?')
})
/*
  Time
*/
bot.hears('quelle heure', ['ambient'], (bot, message) => {
    let date = new Date()
    let time = date.getHours() + ':' + date.getMinutes()
    bot.reply(message, 'il est ' + time)
})
/*
  Weather
*/
let forecasts = {}
fetch('http://www.prevision-meteo.ch/services/json/nantes').then(res => res.json()).then(json => forecasts = json)
bot.hears('quel temps', ['ambient'], (bot, message) => {
    console.log('complete message was : ', message.text)
    let today = (message.text.indexOf('demain') === -1)
    let forecast = today ? forecasts.fcst_day_0 : forecasts.fcst_day_1
    let response = today ? 'aujourd\'hui ' : 'demain '
    response += 'il fera entre ' + forecast.tmin + '° et ' + forecast.tmax + '°'
    bot.reply(message, response)
})