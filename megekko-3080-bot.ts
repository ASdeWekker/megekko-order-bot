// Telegram bot to check the order status of your Megekko NVIDIA order.

// Imports.
import { Builder, By, Key, until, WebDriver } from "selenium-webdriver"
import firefox from "selenium-webdriver/firefox"
import "geckodriver"
import Telegraf from "telegraf"
import dotenv from "dotenv"

// Import the env file and the variables.
dotenv.config({ path: ".env" })
const token: string = process.env.TG_TOKEN !== undefined ? process.env.TG_TOKEN : ""
const chatID: string = process.env.CHATID !== undefined ? process.env.CHATID : ""
const orderid: string = process.env.ORDERID !== undefined ? process.env.ORDERID : ""
const postcode: string = process.env.POSTAL_CODE !== undefined ? process.env.POSTAL_CODE : ""

// Other variables.
const url: string = "https://www.megekko.nl/info/RTX-3080"
const title: string = "Megekko.nl - Nvidia RTX3000 en AMD Ryzen 5000 statement."
const orderidElem: string = "wachtrij_orderid"
const postcodeElem: string = "wachtrij_postcode"
const resultElem: string = "wachtrij_output"
const resultText: string = "Voer je orderID en postcode in."
const parse: string = "Markdown"
let msgInterval: any

// Create a new bot.
const bot: any = new Telegraf(token)

// Set up the selenium configuration.
const options: any = new firefox.Options()
options.setBinary("/usr/lib/firefox/firefox").headless()

const getPosition: any = async () => {
	let driver: WebDriver = await new Builder()
		.forBrowser("firefox")
		.setFirefoxOptions(options)
		.build()
	
	// Try catch block used to get the values.
	try {
		await driver.get(url)
		await driver.wait(until.titleIs(title), 3000)
		await driver.findElement(By.id(orderidElem)).sendKeys(orderid)
		await driver.findElement(By.id(postcodeElem)).sendKeys(postcode, Key.TAB, Key.RETURN)
		await driver.wait(until.elementTextIs(driver.findElement(By.id(resultElem)), resultText), 5000)
		let elems: any[] = await (await driver.findElement(By.id(resultElem))).findElements(By.css("div"))
		return await elems[7].getText()
	} catch (e) {
		console.error(e)
	} finally {
		await driver.quit()
	}
}

const msgPosition: any = async () => {
	let position: any = await getPosition()
	bot.telegram.sendMessage(chatID, `Je staat op plek ${position}`, { parse_mode: parse })
}

bot.on("text", (ctx: any) => {
	let msg: string = ctx.message.text.toLowerCase()
	if (msg === "check") {
		msgInterval = setInterval(msgPosition, 3600000)
		return ctx.reply("Even kijken of je al wat bent opgeschoten.")
	} else if (msg === "plek") {
		msgPosition()
		return ctx.reply("Even kijken...")
	} else if (msg === "stop") {
		clearInterval(msgInterval)
		return ctx.reply("De updates zullen stoppen.")
	} else {
		return ctx.replyWithHTML("Stuur <b><i>plek</i></b> om te kijken op welke plek je nu staat.  Stuur <b><i>check</i></b> om elk uur te kijken op welke plek je staat of hoe lang de rij is.  Stuur <b><i>stop</i></b> om deze check uit te zetten.")
	}
})

bot.on("sticker", Telegraf.reply("👍"))

// Launch the bot.
bot.launch()
