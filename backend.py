# -*- coding: utf-8 -*-
import json
import redis
from flask import Flask,jsonify,render_template,request
from flask import request, jsonify
from flask_cors import CORS
import Queue
from multiprocessing.managers import BaseManager

app = Flask(__name__)
CORS(app, resources=r'/*')
returnMsg = {}
uid = "0"
tempUID = "0"#this uid is the uid to indicate which user is login

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
    global tempUID
    '''receive data'''
    recv_data = request.get_data()
    if recv_data:
        #print recv_data
        json_re = json.loads(recv_data)
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        key = json_re['uid']+" password"
        print(key)
        password = client.get(key)
        print(password)
        if password == json_re['password']:
            tempUID = json_re['uid']
            returnMsg['reply'] = "1"
            return json.dumps(json.dumps(returnMsg))
            #return json.dumps(returnMsg)

    else:
        print("login.py receive data is empty")

    '''send data'''
    returnMsg['reply'] = "0"
    return json.dumps(json.dumps(returnMsg))

#this is backend code for get user's ID
@app.route('/getUid',methods=['GET','POST'])#this is route setting
def getUid():
    returnUid = {}
    returnUid['uid'] = tempUID
    return json.dumps(json.dumps(returnUid))

#this is backend code for saving users' input message
@app.route('/saveData',methods=['GET','POST'])#this is route setting
def saveData():
    recv_data = request.get_data()
    if recv_data:
        json_re = json.loads(recv_data)
        userId = json_re['uid']
        roomNumber = json_re['roomNumber']
        inputText = json_re['inputText']
        dateTime = json_re['dateTime']

        listK = "room"+roomNumber #eg "room1"
        listV = userId+" "+dateTime+" "+inputText #eg "0 2019-8-7 19:46:39 testMsg"

        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        client.rpush(listK, listV)
    return json.dumps(json.dumps("{ok:ok}"))


#this is sample code for one single system
@app.route('/queryData',methods=['GET','POST'])#this is route setting
def queryData():
    returnList = {}
    client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
    
    for x in range(client.llen("room1")):
        key = "room1"+str(x)
        returnList[key] = client.lpop("room1")


    for y in range(client.llen("room2")):
        key = "room2"+str(y)
        returnList[key] = client.lpop("room2")
    return json.dumps(json.dumps(returnList))




@app.route('/saveHis',methods=['GET','POST'])#this is route setting
def saveHis():
    recv_data = request.get_data()
    if recv_data:
        #print recv_data
        json_re = json.loads(recv_data)
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        client.set(json_re['roomhis'],json_re['data'])
    else:
        print("register.py receive data is empty")
    
    return json.dumps(json.dumps("ok"))


@app.route('/requestHis',methods=['GET','POST'])#this is route setting
def requestHis():
    returnList = {}
    recv_data = request.get_data()
    if recv_data:
        #print recv_data
        json_re = json.loads(recv_data)
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        returnList['msg'] = client.get(json_re['roomhis'])
    else:
        print("register.py receive data is empty")
    
    return json.dumps(json.dumps(returnList))




"""
task_num = 10

task_queue = Queue.Queue(task_num)
result_queue = Queue.Queue(task_num)


def get_task():
    return task_queue


def get_result():
    return result_queue



class QueueManager(BaseManager):
    pass

#this is used for distributed model
@app.route('/queryData',methods=['GET','POST'])#this is route setting
def queryData():
    QueueManager.register('get_task_queue', callable=get_task)
    QueueManager.register('get_result_queue', callable=get_result)
    manager = QueueManager(address=('127.0.0.1', 6379), authkey='qty')

    manager.start()

    task = manager.get_task_queue()
    result = manager.get_result_queue()

    returnList = {}

    try:
        client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        print "???"
        print client.llen("room1")
        print "!!!"
        total = client.llen("room1")+client.llen("room2")
        print "??"
        print "%d",total

        for x in range(client.llen("room1")):
            task.put("room1")
        for y in range(client.llen("room2")):
            task.put("room2")

        for i in range(total):
            tempList = result.get(timeout=10)
            for x in tempList:
                returnList[x] = tempList[x]



    except:
        print 'manage error'
    finally:
        manager.shutdown()
        print 'master exit!'
        return json.dumps(json.dumps(returnList))

"""


if __name__ == '__main__':
    app.run(host='0.0.0.0',#make sure any IP can visit
            port=7777,
            debug=True
            )
