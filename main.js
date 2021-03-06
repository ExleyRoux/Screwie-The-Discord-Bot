const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const {prefix} = require('./config.json');
var http = require('http');


const client = new Discord.Client();
client.commands = new Discord.Collection;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let myVoiceChannel = null;
let myTextChannel = null;


/*
{ 
activity: 
{
    type:'LISTENING',
    //type:'PLAYING',
    //type:'STREAMING',
    //type:'WATCHING',
    //
    //name: 'with feelings and breaking hearts'
    //name: 'poeple waist their lives'
    name: 'poeple talking shit'
}, 
//status: 'invisible'
status: 'online'
}
*/

client.once('ready',async () =>
{
    //client.user.setPresence(presenceOptions[0])/*.then(console.log)*/.catch(console.error);


    client.guilds.cache.each((guild) => 
    {
        //console.log(guild);
        if(guild.name === 'Team C')
        {
            guild.channels.cache.each( (channel) =>
            {
                if(channel.parent != null){
                    if(channel.parent.name === 'Bot')
                    {
                        if(channel.type === 'text')
                        {
                            myTextChannel = channel;
                        }
                        else if(channel.type === 'voice')
                        {
                            myVoiceChannel = channel;
                        }
                    }
                }
            });
        }
    });

    //myTextChannel.send("I am no longer constrained to replies");

    console.log(`Logged in as ${client.user.tag} !`);
});

client.on('typingStart', typing => {
});

client.on('message', message => 
{
    if(!message.content.startsWith(prefix))return;
    if(message.author.bot)return;
    if(!message.guild)return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(commandName);

    if(!client.commands.has(commandName))return;
    const command = client.commands.get(commandName);

    try
    {
        if(command.args)
        {
            const embed = new Discord.MessageEmbed().setColor('#03c2fc').setTitle('Usage').setDescription(command.usage);
            if(!args.length)
            {
                c/*onst embed = new Discord.MessageEmbed()
                .setColor('#03c2fc')
                .setTitle('Usage')
                .setDescription('You have not provided enough arguments')
                .addField('Usage', command.usage, true)
                .setFooter("Skrewie's error log");
                message.reply(embed);*/
                return;
            }
        }

        command.execute(client, message,args);
    }
    catch(ex)
    {
        console.error(ex);
        message.reply('There wan an issues executing that command');
    }
});

client.login(process.env.DISCORD_TOKEN);

let webServer = function()
{
    console.log(`Web server started on port : ${process.env.YOUR_PORT || process.env.PORT || 'Port Not found'}`);
    http.createServer(function (req, res) 
    {
        console.log('Website opened');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Hey I'm Skrewie thge Discord Bot");
    }).listen(process.env.YOUR_PORT||process.env.PORT, '0.0.0.0'); 
}

//webServer();