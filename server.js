const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');
const lodash = require('lodash');
const ejs = require('ejs');


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static_files"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signUp.html");
})

app.post("/", function(req,res){

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
     members: [
       { //This curly bracket is to signify the details of first member, apnko ek baar me ek hi bhejna hai isliye aur objects nhi banaye.
         email_address: email,
         status: "subscribed",
         merge_fields: {
           FNAME: firstName,
           LNAME: lastName
       }
     }
    ]
  }

  var jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/f1d8adbca4";
  const options = {
    method: 'POST',
    auth: 'vedant:adc2fbaed93f0d3ff0f47816c97ef95a-us5'
  }

  var request = https.request(url, options, function(response){
    if(response.statusCode == 200){
      res.sendFile(__dirname + "/success.html");
    }

    else{
      res.sendFile(__dirname + "/failure.html");
    }
  })

  request.write(jsonData);
  request.end();
})

app.post('/success', function(req,res){
  const city = req.body.city;
  const url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5c377f534b91c074b0d50362cbcd4cbe&units=metric";
  https.get(url1, function(response){
        if(response.statusCode == 200){
          response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const feels_like = weatherData.main.feels_like;
            const weatherCondition = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.render('weather', {
              city: lodash.capitalize(city),
              temperature: temperature,
              feels_like: feels_like,
              weatherCondition: weatherCondition,
              imgURL: imgURL
            });
          })
        }
        else{
          res.sendFile(__dirname + '/success.html');
        }
    })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running at port 3000.");
})

//API KEY FOR WEATHER DATA: 5c377f534b91c074b0d50362cbcd4cbe

//API KEY FOR MAILCHIMP's SERVER: adc2fbaed93f0d3ff0f47816c97ef95a-us5
//List ID: f1d8adbca4
//URL: https://us19.admin.mailchimp.com/; us5 in our case
