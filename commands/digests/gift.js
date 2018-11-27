const commando = require("discord.js-commando");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const PImage = require("pureimage");

const Jimp = require("jimp");
const giphy = require("./giphy_api_token.json");
const giphy_api_key = giphy["api_token"];

module.exports = class eCardCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "gift",
      aliases: [],
      group: "digests",
      memberName: "ecard",
      description: "Send someone a cool Christmas GIFt :)",
      details: "Send someone a cool Christmas GIFt :)",
      examples: ["gift @someone"]
    });
  }

  async run(msg, args) {
    if (args.length > 0) {
      let msg_array = args.split(" ");
      let message = "";
      var user = "";
      let receiver = msg.mentions.members.first();

      console.log(receiver.toString());

      msg.mentions.members.forEach(function(guildMember, guildMemberId) {
        console.log(guildMember.user.username);
        receiver = guildMember.user;
      });

      let sender = msg.message.author;

      msg.channel.send(
        `${sender} just sent a mystery gift to ${receiver} :gift:`
      );
      let emojis = ["eye", "gift", "eyes"];

      let random_emoji = emojis[getRandomNumber(0, emojis.length - 1)];
      msg.channel.send(`:${random_emoji}:`);

      let limit = 6;
      let search_terms = [
        "christmas",
        "festive",
        "christmas at night",
        "funny christmas",
        "christmas tree",
        "christmas lights"
      ];

      let search_term =
        search_terms[getRandomNumber(0, search_terms.length - 1)];
      console.log(search_term);

      let options = ["gifs", "stickers"];
      let ran_number = getRandomNumber(0, options.length - 1);

      let option = options[ran_number];

      let giphy_link = `https://api.giphy.com/v1/${option}/search?rating=g&api_key=${giphy_api_key}&limit=${limit}&q=${search_term}`; // INSERT LINK HERE

      // GET A GIPHY GIF
      fetch(giphy_link)
        .then(res => res.json())
        .then(out => {
          if (out.data.length === 0) {
            msg.reply(
              "There was a problem, something went wrong. Try again maybe? :D"
            );
          } else {
            var randomNumber = getRandomNumber(0, limit - 1);
            var giphy_gif_link = out.data[randomNumber].bitly_gif_url;

            let member_to_send = msg.mentions.members.first();
            member_to_send.send(
              `You received a mystery GIFt (get the pun? :wink:) from ${sender}!`
            );
            member_to_send.send(giphy_gif_link);
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      // User didn't enter any keywords
      msg.reply(
        "Try mentioning a person eg: `" +
          `${this.client.commandPrefix}` +
          " @someone`"
      );
    }

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
