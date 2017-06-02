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
const _ = require('underscore');
const Chance = require('chance');
const chance = new Chance();
const shuffle = require('shuffle-array');

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

/*                            __      ___    __       
  |__| |  |  |\/|  /\  |\ | |  /  /\   |  | /  \ |\ | 
  |  | \__/  |  | /~~\ | \| | /_ /~~\  |  | \__/ | \| */
/*
  Tools
*/
const pick = (arr) => shuffle(arr)[0]
const firstCap = (str) => str.charAt(0).toUpperCase() + str.slice(1)
/* 
  Vocabulary
*/
const endPunctuation = (withFun) => pick(withFun ? [' :)', ' :D'] : ['.', '.', '', '...'])
const greetings = ['salut ', 'hello ', 'hey ']
const greeting = () => pick(greetings)
const feelingsGood = ['ça roule', 'ça va', 'nickel', 'comme un vendredi']
const feelingGood = () => pick(feelingsGood)
/*
  Interactions
*/
const say = (str, withFun) => firstCap(str + endPunctuation(withFun))
const welcome = (who) => say(greeting() + who, true)
/*
  Brain
*/

/* ___  __        __       ___    __       
  |__  |  \ |  | /  `  /\   |  | /  \ |\ | 
  |___ |__/ \__/ \__, /~~\  |  | \__/ | \|  */
/*
  Hello
*/
bot.hears('ça va', ['ambient'], (bot, message) => {
  if (message.text.indexOf('?') === -1) {
    return
  }
  bot.reply(message, say(feelingGood() + ' et toi ?'))
})
/*
  Time
*/
bot.hears('quelle heure', ['ambient'], (bot, message) => {
  if (message.text.indexOf('?') === -1) {
    return
  }
  let date = new Date()
  let time = date.getHours() + ':' + date.getMinutes()
  bot.reply(message, say('il est ' + time))
})
/*
  Weather
*/
let forecasts = {}
fetch('http://www.prevision-meteo.ch/services/json/nantes').then(res => res.json()).then(json => forecasts = json)
bot.hears('quel temps', ['ambient'], (bot, message) => {
  if (message.text.indexOf('?') === -1) {
    return
  }
  console.log('complete message was : ', message.text)
  let today = (message.text.indexOf('demain') === -1)
  let forecast = today ? forecasts.fcst_day_0 : forecasts.fcst_day_1
  let response = today ? 'aujourd\'hui ' : 'demain '
  response += 'il fera entre ' + forecast.tmin + '° et ' + forecast.tmax + '°'
  bot.reply(message, say(response))
})
/*
  Welcome 
*/
bot.hears(greetings, ['mention', 'direct_mention'], (bot, message) => {
  // console.log('got message', message)
  bot.reply(message, welcome(message.user))
})

