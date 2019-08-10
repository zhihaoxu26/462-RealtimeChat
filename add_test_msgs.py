import redis
client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)

#to add 6000 messages to two chatroooms
for x in range(3000):
    client.rpush("room1", x)
    client.rpush("room2", x)