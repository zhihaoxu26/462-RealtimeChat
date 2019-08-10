#To clean all users(uid)!
import redis
client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)

client.set('uid', '0')
#print "uid.value:", client.get("uid")