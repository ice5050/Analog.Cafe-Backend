const redis = require("redis");
const bluebird = require("bluebird");

const client = redis.createClient({ url: process.env.REDIS_URL });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = client;
