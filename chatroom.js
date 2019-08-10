"use strict";
var uid;
var room1 = "";
var room2 = "";
var history1 = "";
var history2 = "";
function change(){
    var roomNumber = document.getElementById("selectValue").value;
    document.getElementById('chatscreen').src = "./chatroom"+roomNumber+".html";
}

function enter(){
    var roomNumber = document.getElementById("selectValue").value;
    var inputText = document.getElementById("inputBox").value;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    document.getElementById("inputBox").value = "";
    $.ajax({
        url: "http://0.0.0.0:7777/getUid",
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            var obj = JSON.parse(data)
            uid = obj.uid
            console.log(data);
        },async: false,
        error: function(err){
            alert("error, returned message has problem, check inspector!")
            console.log(err);
        }
    })
    //alert(dateTime);

    var msg = {
        uid: uid,
        roomNumber: roomNumber,
        inputText: inputText,
        dateTime: dateTime,
    };

    var senddata = JSON.stringify(msg);

    $.ajax({
        url: "http://0.0.0.0:7777/saveData",
        type: "POST",
        data: senddata,
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
        },
        error: function(err){
            alert("error, returned message has problem, check inspector!")
            console.log(err);
        }
    })
}

function display(){
    var acc = 0;
    $.ajax({
        url: "http://0.0.0.0:7777/getUid",
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            var obj = JSON.parse(data)
            uid = obj.uid
            console.log(data);
        },async: false,
        error: function(err){
            alert("error, returned message has problem, check inspector!")
            console.log(err);
        }
    })
    //console.log(uid)
    setInterval(function query() {
        $.ajax({
            url: "http://0.0.0.0:7777/queryData",
            type: "GET",
            dataType: "json",
	        async: false,
            success: function (data) {
                var obj = JSON.parse(data);
                $.each(obj, function(k, v) {
                    var roomNum = k.substring(0,5);
                    var end = 0
                    var end2 = 0
                    //console.log(roomNum)

                    for(var i = 0; i < v.length;i++){
                        if(v[i] == ' '){
                            end = i
                            break
                        }
                    }
                    var userID = v.substring(0,end)
                    console.log("end is ",end)

                    var count = 0
                    for(var j = end+1; j < v.length;j++){
                        if(v[j] == ' '){
                            count++
                            if(count == 2){
                                end2 = j
                                break
                            }
                        }
                    }
                    var dateTime = v.substring(end+1,end2)
                    console.log("dateTime:", dateTime)

                    var msg = v.substring(end2+1)
                    console.log("msg:", msg)

                    console.log("uid is ",uid)
                    if(roomNum == "room1"){
                        var req = {
                            roomhis:"roomhis1",
                        }
                        var sendd = JSON.stringify(req);
                        $.ajax({
                            url: "http://0.0.0.0:7777/requestHis",
                            type: "POST",
                            data: sendd,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                var obj = JSON.parse(data)
                                room1 = obj.msg
                                history1 = obj.msg
                                console.log("ok");
                            },
                            error: function(err){
                                alert("error, returned message has problem, check inspector!")
                                console.log(err);
                            }
                        })
                        if(userID == uid){
                            var str1 = "<p id='right'><span>"+userID+" :</span><br>"+dateTime+"<br><span id='input'>"+msg+"</span></p>"
                            room1+=str1
                            console.log("str1",str1)
                            console.log("room1",room1)
                        }
                        else{
                            var str2 = "<p id='left'><span>"+userID+" :</span><br>"+dateTime+"<br><span id='input'>"+msg+"</span></p>"
                            room1+=str2
                            console.log("str2",str2)
                        }
                        //send data to server
                        var account = {
                            roomhis:"roomhis1",
                            data:room1,
                        }
                        var senddata = JSON.stringify(account);
                        $.ajax({
                            url: "http://0.0.0.0:7777/saveHis",
                            type: "POST",
                            data: senddata,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                console.log("ok");
                            },
                            error: function(err){
                                alert("error, returned message has problem, check inspector!")
                                console.log(err);
                            }
                        })

                        document.getElementById("room1").innerHTML = room1;
                    }
                    else{ 
                        var req = {
                            roomhis:"roomhis2",
                        }
                        var sendd = JSON.stringify(req);
                        $.ajax({
                            url: "http://0.0.0.0:7777/requestHis",
                            type: "POST",
                            data: sendd,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                var obj = JSON.parse(data)
                                room2 = obj.msg
                                history2 = obj.msg
                                console.log("ok");
                            },
                            error: function(err){
                                alert("error, returned message has problem, check inspector!")
                                console.log(err);
                            }
                        })
                        if(userID == uid){
                            var str3 = "<p id='right'><span>"+userID+" :</span><br>"+dateTime+"<br><span id='input'>"+msg+"</span></p>"
                            room2+=str3
                            console.log("str3",str3)
                        }
                        else{
                            var str4 = "<p id='left'><span>"+userID+" :</span><br>"+dateTime+"<br><span id='input'>"+msg+"</span></p>"
                            room2+=str4
                            console.log("str4",str4)
                        }

                        //send data to server
                        var account = {
                            roomhis:"roomhis2",
                            data:room2,
                        }
                        var senddata = JSON.stringify(account);
                        $.ajax({
                            url: "http://0.0.0.0:7777/saveHis",
                            type: "POST",
                            data: senddata,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                console.log("ok");
                            },
                            error: function(err){
                                alert("error, returned message has problem, check inspector!")
                                console.log(err);
                            }
                        })
                        
                        document.getElementById("room2").innerHTML = room2;
                        
                    }
                    window.scroll(0,document.body.scrollHeight)
                });
            },
            error: function(err){
                alert("error, returned message has problem, check inspector!")
                console.log(err);
            }
        })
    }, 1000);
}