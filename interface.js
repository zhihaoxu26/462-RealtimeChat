"use strict";
function login(){
    var ID = document.getElementById("ID").value;
    var password = document.getElementById("password").value;
    var account = {
        uid:ID.toString(),
        password:password.toString(),
    }
    var senddata = JSON.stringify(account);
    $.ajax({
        url: "http://0.0.0.0:7777/login",
        type: "POST",
        data: senddata,
        dataType: "json",
        success: function (data) {
            //if 1 password is correct, otherwise is wrong
            var obj = JSON.parse(data)
            if(obj.reply == "1"){
                window.location.replace("./chatroom.html");
            }
            else{
                alert("your password is wrong!")
            }
            console.log(data);
        },
        error: function(err){
            alert("error, returned message has problem, check inspector!")
            console.log(err);
        }
    })
}