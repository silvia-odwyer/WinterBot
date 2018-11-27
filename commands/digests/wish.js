const commando = require("discord.js-commando");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const giphy = require("./giphy_api_token.json");
const giphy_api_key = giphy["api_token"];

module.exports = class HelpCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "wish",
      aliases: [],
      group: "digests",
      memberName: "wish",
      description: "Say Happy Holidays to someone on the server!",
      details:
        "Say Happy Holidays to someone on the server! This usually sends a GIF.",
      examples: ["wish"]
    });
  }

  async run(msg, args) {
    let msg_array = args.split(" ");
    let message = "";
    var user = "";
    var limit = 6;
    let search_terms = ["happy+christmas", "happy+holidays", "merry+christmas"]
    let ran_num2 = getRandomNumber(0, search_terms.length - 1);
    let search_term = search_terms[ran_num2];

    let giphy_link = `https://api.giphy.com/v1/gifs/translate?rating=g&api_key=${giphy_api_key}&s=${search_term}`; // INSERT LINK HERE

    // GET A GIPHY GIF
    fetch(giphy_link)
      .then(res => res.json())
      .then(out => {
        console.log(out.data);
        console.log("BITLY LINK");
        console.log(out.data.bitly_gif_url);

        let receiver = ""
        // Get the user mentioned 
        msg.mentions.members.forEach(function(guildMember, guildMemberId) {
            console.log(guildMember.user.username);
            receiver = guildMember.user;
          })
        
        let messages = ["wishes to say HAPPY CHRISTMAS", "wishes to say MERRY CHRISTMAS", "wants to just say MERRY CHRISTMAS", "would love to say MERRY CHRISTMAS", "just wants to say MERRRRRY CHRISSTMAS"];

        let ran_num = getRandomNumber(0, messages.length - 1);

        let message = messages[ran_num];

        msg.channel.send(`${msg.author} ${message} to ${receiver}!`);

        msg.channel.send(out.data.bitly_gif_url);

        
        member_to_send
          .send({
            files: ["media/powered_by_giphy.png"]
          })
          .catch(console.error);
      })
      .catch(err => {
        throw err;
      });

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
