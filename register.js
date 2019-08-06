"use strict";
function register(){

    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;
    if(password1 != password2){
        alert("Please confirm you password, they need to be the same!");
        return;
    }

    var account = {
        password:password1.toString(),
    };

    var senddata = JSON.stringify(account);

    //console.log(senddata)

    $.ajax({
        url: "http://0.0.0.0:7777/register",
        type: "POST",
        data: senddata,
        dataType: "json",
        success: function (data) {
            var obj = JSON.parse(data)
            document.getElementById("display").innerHTML = "<p>This is your unique User ID:</p>"+"<p style='color:red;'>"+obj.uid+"</p>"+"<p>Don't lose it!</p>"
            +"<button "+"id='backButton'"+"onclick="+'"'+"window.location.href = './interface.html';"+'"'+">Login Page</button>";
            console.log(data);
        },
        error: function(err){
            alert("error, returned message has problem, check inspector!")
            console.log(err);
        }
    })
}
