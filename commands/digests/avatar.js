const commando = require("discord.js-commando");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const PImage = require("pureimage");
const fs = require("fs");

const Jimp = require("jimp");
const giphy = require("./giphy_api_token.json");

module.exports = class eCardCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: [],
      group: "digests",
      memberName: "avatar",
      description: "Send someone a cool Christmas gift :)",
      details: "Send someone a cool Christmas gift :)",
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

      sendCardJimp(msg.author, receiver, msg);
    } else {
      // User didn't enter any keywords
      msg.reply(
        "Try mentioning a person eg: `" +
          `${this.client.commandPrefix}` +
          " @someone`"
      );
    }

    function sendCard() {
      PImage.decodeJPEGFromStream(fs.createReadStream("imgs/winter.jpg")).then(
        img => {
          console.log("size is", img.width, img.height);
          var img2 = PImage.make(50, 50);
          var c = img2.getContext("2d");
          c.drawImage(
            img,
            0,
            0,
            img.width,
            img.height, // source dimensions
            0,
            0,
            50,
            50 // destination dimensions
          );
          PImage.encodeJPEGToStream(
            img2,
            fs.createWriteStream("./winter_edited.jpg")
          ).then(() => {
            console.log("done writing");

            msg.channel.send("Message that goes above image", {
              files: ["./winter_edited.jpg"]
            });
          });
        }
      );
    }

    function sendCardJimp(sender, receiver, msg) {
      // open a file called "lenna.png"

      let images = [
        "winter1.png",
        "winter2.png",
        "winter3.png",
        "winter4.png",
        "winter5.png"
      ];
      let ran_num = getRandomNumber(0, images.length - 1);
      let image = images[ran_num];

      Jimp.read(msg.author.avatarURL, (err, image) => {
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
