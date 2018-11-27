const commando = require("discord.js-commando");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const fs = require("fs");

const Jimp = require("jimp");

module.exports = class eCardCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "card",
      aliases: [],
      group: "digests",
      memberName: "card",
      description: "Send someone a cool Christmas card :)",
      details: "Send someone a cool Christmas card :)",
      examples: ["card @someone"]
    });
  }

  async run(msg, args) {
    if (args.length > 0) {
      let msg_array = args.split(" ");
      let message = "";
      var user = "";
      let receiver = msg.mentions.members.first();

      msg.mentions.members.forEach(function(guildMember, guildMemberId) {
        console.log(guildMember.user.username);
        receiver = guildMember.user.username;
      });

      console.log(receiver.toString());

      sendCardJimp(msg.author, receiver);
    } else {
      // User didn't enter any keywords
      msg.reply(
        "Try mentioning a person eg: `" +
          `${this.client.commandPrefix}` +
          " @someone`"
      );
    }

    function sendCardJimp(sender, receiver) {
      // open a file called "lenna.png"

      let images = [
        "winter1.PNG",
        "winter2.PNG",
        "winter3.PNG",
        "winter4.PNG",
        "winter5.PNG"
      ];
      let ran_num = getRandomNumber(0, images.length - 1);
      let image = images[ran_num];

      Jimp.read(image, (err, image) => {
        if (err) throw err;

        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
          image.resize(300, 300);

          image.print(font, 20, 150, `${sender.username} wishes`);
          image.print(font, 20, 200, ` **** ${receiver} ****`);
          image.print(font, 20, 240, `a Merry Christmas!`);

          image.write("winter_card.jpg"); // save

          msg.channel.send(`${receiver} just received a card!`, {
            files: ["./winter_card.jpg"]
          });
        });
      });
    }

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
