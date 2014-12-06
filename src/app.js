var UI = require('ui');
var ajax = require('ajax');
var vibe = require('ui/vibe');
var Vector2 = require('vector2');

// Core ID is 54ff6cXXXXXXXXXXXXXXXXXXX
// Your access token is 813b2XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// curl https://api.spark.io/v1/devices/54ff6cXXXXXXXXXXXXXXXXXX/OperateDoor -d access_token=813b2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX -d "args=CLOSE"

var device_name = "Smart Garage";

var DEVICE_ID = "54ff6cXXXXXXXXXXXXXXXXX";
var ACCESS_TOKEN = "813b2XXXXXXXXXXXXXXXXX1XXXXXXXXXXXXXXXX";
//var SPARKCORE_FUNCTION = "OperateDoor";

console.log(device_name + " app started");

// Create a Card with title and subtitle
var card = new UI.Card();
DrawCard(device_name,"started...","");
card.show();
var status_window = new UI.Window();

var splash_window = new UI.Window();

var main_window = new UI.Window();


//***************************
//*** FUNCTIONS *************
  

function DoPost(function_name,function_value){
  console.log("DoPost(): " + new Date().getTime());  
  
  //display card
  DrawCard("Attempt Post","sending...","");
  
  //make url based on function being called and device tokens
  var URL = 'https://api.spark.io/v1/devices/' + DEVICE_ID + '/' + function_name +'?access_token=' + ACCESS_TOKEN; //identify which sparkcore and function
  
  //log data being used
  console.log("function_name: " + function_name);
  console.log("function_value: " + function_value);
  console.log("URL: " + URL);
  
  ajax(
    {
      url: URL,
      method: 'post',
      type: 'json',
      data: { "args": function_value} //string to send to the sparkcore function, can be named whatever
    },
    function(data) {
      // Success
      console.log("Success: " + JSON.stringify(data));
      vibe.vibrate('short');
      // Show to user
      DrawCard("POST", "success: " + function_value, JSON.stringify(data));
    },
    function(error) {
      // Failure
      console.log('Failed: ' + error.toString());
      
      DrawCard("POST", "failed: " + function_value, error.toString());
      
    }
  );
  
  console.log("Comleted DoPost(): " + new Date().getTime());  
}


function DoGet(function_name){
  console.log("DoGet(): " + new Date().getTime());  
  
  //display card
  DrawCard("Attempt GET","sending...","");
  
  //make url based on function being called and device tokens
  var URL = 'https://api.spark.io/v1/devices/' + DEVICE_ID + '/' + function_name +'?access_token=' + ACCESS_TOKEN; //identify which sparkcore and function
  
  //log data being used
  console.log("function_name: " + function_name);
  console.log("URL: " + URL);
  
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success
      console.log("Success: " + JSON.stringify(data));
      vibe.vibrate('short');
      // Show to user
      
      if(data.result==1){
        DrawStatusWindow("CLOSED");
      }else if(data.result==0){
        DrawStatusWindow("OPEN");
        
      }else{
        DrawStatusWindow("UNKN: " + data.result);
      }
    },
    function(error) {
      // Failure
      console.log('Failed: ' + error.toString());
      DrawStatusWindow("FAILED"); 
    }
  );
  
  console.log("Comleted DoGet(): " + new Date().getTime());  
}



function DrawCard(title,subtitle,body){
  console.log("DrawCard: " + new Date().getTime());  
  
  card.title(title);
  card.subtitle(subtitle);
  card.body(body);
  
  console.log("Comleted DrawCard: " + new Date().getTime());  
}



function DrawStatusWindow(status){
  
  status_window.each(function(element) {
    status_window.remove(element);
  });

  status_window.backgroundColor('black');
   var txtLabel = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 30),
    font: 'Gothic 24',
    text: 'DOOR CURRENTLY:',
    textAlign: 'left',
    color: 'white'
  });
  var txtStatus = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'Bitham 30 Black',
    text: status,
    textAlign: 'center',
    color: 'white'
  });
  status_window.add(txtLabel);
  status_window.add(txtStatus);
  status_window.show();
  
  
  
}






//BUTTON ACTIONS
card.on('click', 'up', function(e) {
  console.log("click up");
  DoPost('OperateDoor','OPEN');
});

card.on('click', 'down', function(e) {
  console.log("click up");
  DoPost('OperateDoor','CLOSE');
});


card.on('click', 'select', function(e) {
  console.log("click select");
  DoGet('isClosed');
});


card.on('click', 'select', function(e) {
  DrawCard(device_name,"started...","");
  status_window.hide();
});





