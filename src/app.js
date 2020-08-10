//Data base and models
require('./db/mongoose')

//Tools
const { commandCreate, commandWaifu, commandTrain, commandFight, commandHelp } = require('./tools/commands')

//Packages
const discord = require('discord.js')

//General config
const { response } = require('express')
const client = new discord.Client()
const prefix = "!wb"

client.on("ready", () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("!wb help")
})

client.on("message", async (receivedMessage) => {

    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith(prefix)) {

        const message = receivedMessage.content.split(" ")

        if (message.length > 1) {
            const command = message[1]
            const author = receivedMessage.author

            const user = {
                discordId: author.id,
                username: author.username,
                discriminator: author.discriminator,
                at: author.toString(),
                trainCooldown: new Date(),
                fightCooldown: new Date(),
                waifu: undefined,
                combatsWon: 0,
            }

            let response = undefined

            switch (command) {
                case "create":
                    const responseCreate = await commandCreate(user)
                    receivedMessage.channel.send(responseCreate.message)
                    break

                case "waifu":
                    const responseWaifu = await commandWaifu(user)
                    receivedMessage.channel.send(responseWaifu.message)
                    break

                case "train":
                    const responseTrain = await commandTrain(user)
                    receivedMessage.channel.send(responseTrain.message)
                    break

                case "fight":
                    const responseFight = await commandFight(user, message)
                    receivedMessage.channel.send(responseFight.message)
                    break

                case "help":
                    response = await commandHelp(user)
                    receivedMessage.channel.send(response)
                    break

                default:
                    receivedMessage.channel.send("That's not a valid command, use `" + `${prefix}` + " help` to see all commands.")
                    break
            }
        }
    }
})

client.login(process.env.DISCORD_API_KEY).then((result) => {

}).catch((error) => {
    console.log(error)
})


