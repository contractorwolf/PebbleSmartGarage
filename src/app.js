var UI = require('ui');
var ajax = require('ajax');
var vibe = require('ui/vibe');
var Vector2 = require('vector2');

var device_name = "Smart Garage";

var DEVICE_ID = "54ff6c066672524825502067";
var ACCESS_TOKEN = "f750c35957681c73f09b59c7b0fda1465e3ce903";

console.log(device_name + " app started");


var main_window = new UI.Window();


//static text for buttons
var txtOpenLabel = new UI.Text({
    position: new Vector2(0, 20),
    size: new Vector2(144, 30),
    font: 'Gothic 24',
    text: 'open',
    textAlign: 'right',
    color: 'white'
});

var txtCloseLabel = new UI.Text({
    position: new Vector2(0, 105),
    size: new Vector2(144, 30),
    font: 'Gothic 24',
    text: 'close',
    textAlign: 'right',
    color: 'white'
});

var txtUpdateLabel = new UI.Text({
    position: new Vector2(0, 62),
    size: new Vector2(144, 30),
    font: 'Gothic 24',
    text: 'update',
    textAlign: 'right',
    color: 'white'
});

var txtHeaderLabel = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 30),
    font: 'Gothic 18',
    text: 'Sparkcore',
    textAlign: 'center',
    color: 'white'
});

var txtFooterLabel = new UI.Text({
    position: new Vector2(0, 130),
    size: new Vector2(144, 30),
    font: 'Gothic 18',
    text: 'SmartGarage',
    textAlign: 'center',
    color: 'white'
});




//initialization
UpdateMain('started');
DoGet('isClosed');






//***************************
//*** FUNCTIONS *************
  

function UpdateMain(message){
  main_window.each(function(element) {
    main_window.remove(element);
  });
  main_window.each(function(element) {
    main_window.remove(element);
  });

  main_window.backgroundColor('black');

  var txtStatus = new UI.Text({
    position: new Vector2(5, 62),
    size: new Vector2(144, 10),
    font: 'Gothic 28 Bold',
    text: message,
    textAlign: 'left',
    color: 'white'
  });
  
  main_window.add(txtHeaderLabel);
  main_window.add(txtOpenLabel);
  main_window.add(txtStatus);
  main_window.add(txtUpdateLabel);  
  main_window.add(txtCloseLabel);
  main_window.add(txtFooterLabel);
   
  
  main_window.show();
}

function DoPost(function_name,function_value){
  console.log("DoPost(): " + new Date().getTime());  
  
  //display card
  UpdateMain("Attempt");
  
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
      if(data.return_value===0){
        UpdateMain("Closing"); 
      }else if(data.return_value==1){
        UpdateMain("Opening");      
      }else{
        UpdateMain("UNKN:" + data.return_value);      
      }
      
      //setTimeout(GetIsClosed(), 30000);
    },
    function(error) {
      // Failure
      console.log('Failed: ' + error.toString());
      
      UpdateMain("FAILED");
      
    }
  );
  
  console.log("Comleted DoPost(): " + new Date().getTime());  
}

function GetIsClosed(){
  DoGet('isClosed');
  
}

function DoGet(function_name){
  console.log("DoGet(): " + new Date().getTime());  
  
  //display card
  UpdateMain("Updating");
  
  //make url based on function being called and device tokens
  //https://api.spark.io/v1/devices/54ff6c066672524825502067/isClosed?access_token=813b2eb1b01a95380a0a1c58a70e64316f64d758
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
        UpdateMain("Closed");
      }else if(data.result===0){
        UpdateMain("Open");
        
      }else{
        UpdateMain("UNKN: " + data.result);
      }
    },
    function(error) {
      // Failure
      console.log('Failed: ' + error.toString());
      UpdateMain("FAILED"); 
    }
  );
  
  console.log("Comleted DoGet(): " + new Date().getTime());  
}




//BUTTON ACTIONS
main_window.on('click', 'up', function(e) {
  console.log("click up");
  DoPost('OperateDoor','OPEN');
});

main_window.on('click', 'down', function(e) {
  console.log("click up");
  DoPost('OperateDoor','CLOSE');
});


main_window.on('click', 'select', function(e) {
  console.log("click select");
  DoGet('isClosed');
});



