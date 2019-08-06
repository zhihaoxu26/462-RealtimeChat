# -*- coding: utf-8 -*-
import json
import redis
from flask import Flask,jsonify,render_template,request

app = Flask(__name__)

returnMsg = {}
uid = "0"

#this is backend code for register
@app.route('/register',methods=['GET','POST'])#this is route setting
def register():
    global uid
    '''receive data'''
    recv_data = request.get_data()
    if recv_data:
        #print recv_data
        json_re = json.loads(recv_data)
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        uid = client.get("uid")
        client.set(uid+" password",json_re['password'])
        client.set("uid", str(int(uid)+1))
        #print json_re['password']
    else:
        print("register.py receive data is empty")

    '''send data'''
    returnMsg['uid'] = uid
    return json.dumps(json.dumps(returnMsg))

#this is backend code for login
@app.route('/login',methods=['GET','POST'])#this is route setting
def login():
    '''receive data'''
    recv_data = request.get_data()
    if recv_data:
        #print recv_data
        json_re = json.loads(recv_data)
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        key = json_re['uid']+" password"
        print(key)
        password = client.get(key)
        if password == json_re['password']:
            returnMsg['reply'] = "1"
            return json.dumps(json.dumps(returnMsg))

    else:
        print("login.py receive data is empty")

    '''send data'''
    returnMsg['reply'] = "0"
    return json.dumps(json.dumps(returnMsg))


if __name__ == '__main__':
    app.run(host='0.0.0.0',#make sure any IP can visit
            port=7777,
            debug=True
            )
