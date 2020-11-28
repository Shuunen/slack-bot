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
// const _ = require('underscore');
// const Chance = require('chance');
// const chance = new Chance();
const shuffle = require('shuffle-array')

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
const withFun = true
/*
  Vocabulary
*/
const endPunctuation = (withFun) => pick(withFun ? [' :stuck_out_tongue:', ' :p', ' :)', '', ' :smile:', ' :sunglasses:', ' :grin:'] : ['.', '.', '', '...'])
const greetings = ['salut ', 'hello ', 'hey ', 'ça va ', 'ca va ']
const greeting = () => pick(greetings)
const feelingsGood = ['ça roule ', 'ça va ', 'nickel ', 'comme un vendredi ']
const feelingGood = () => pick(feelingsGood)
const deNadas = ['mais de rien ', 'de rien ', 'c\'est moi ']
const thanks = ['merci']
const byebyes = ['à plus ', 'à bientôt ', 'ciao ', 'bon weekend ', 'bye ']
const byebye = () => pick(byebyes)
/*
  Interactions
*/
const say = (str, withFun) => firstCap(str + endPunctuation(withFun))
const welcome = (userId) => say(greeting() + name(userId), withFun)
const deNada = (userId) => say(pick(deNadas) + name(userId), withFun)
const goodBye = (userId) => say(byebye() + name(userId), withFun)
/*
  Brain
*/
const names = {
  'U0760C9CL': 'Romain', // me
  'U21PGPWE9': 'Romain',
  'U0YBJJB0B': 'Léo',
  'U0AMSTYCB': 'Bertrand',
  'U23HBPVB2': 'Floris',
  'U1Y7HMH1Q': 'Pauline',
  'U0EQPACE6': 'Florian',
  'U0YCZU9MY': 'Benjamin'
}
const name = (id) => (names[id] || '')

/* ___  __        __       ___    __
  |__  |  \ |  | /  `  /\   |  | /  \ |\ |
  |___ |__/ \__/ \__, /~~\  |  | \__/ | \|  */
const context = ['mention', 'direct_mention']
/*
  Hello
*/
bot.hears('ça va', context, (bot, message) => {
  if (message.text.indexOf('?') === -1) {
    return
  }
  bot.reply(message, say(feelingGood() + 'et toi ?'))
})
/*
  Time
*/
bot.hears('quelle heure', context, (bot, message) => {
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
bot.hears(['quel temps', 'quel temp'], context, (bot, message) => {
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
bot.hears(greetings, context, (bot, message) => {
  // console.log('got message', message)
  bot.reply(message, welcome(message.user))
})
/*
  Polite
*/
bot.hears(thanks, context, (bot, message) => {
  // console.log('got message', message)
  bot.reply(message, deNada(message.user))
})
/*
 Leave
*/
bot.hears(byebyes, context, (bot, message) => {
  // console.log('got message', message)
  bot.reply(message, goodBye(message.user))
  console.log('ok im leaving :p')
  setTimeout(() => process.exit(0), 2000)
})
