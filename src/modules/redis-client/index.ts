import { RedisClient } from './lib/redis-client';

const redisClients = {};

function redisClient(id: string = 'default'): RedisClient {
  return redisClients[id];
}

const createRedisClient = async function createClient( id: string, connectionstring ): Promise<RedisClient> {
  if (id && connectionstring) {
    const client = new RedisClient(id, connectionstring);
    await client.init();

    return (client[id] = client);
  } else {
    throw new Error('REDIS ERROR');
  }
};

export { RedisClient, redisClient, createRedisClient };
