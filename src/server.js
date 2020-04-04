const { Server } = require("@hapi/hapi");
const joi = require("@hapi/joi");
const axios = require("axios");

// TODO: Validate arguments before starting

const STREAMLABS_ENDPOINT = 'https://streamlabs.com/api/v1.0/alerts';

const initServer = (config) => {
  const server = new Server({
    port: config.port,
  });

  server.route([
    {
      method: 'POST',
      path: '/github',
      options: {
        validate: {
          payload: joi.object({
            hook: joi.object({ "events": joi.array().items(joi.string()) }).required().unknown(),
            sender: joi.object({login: joi.string().required()}).required().unknown(),
            repository: joi.object({full_name: joi.string().required()}).required().unknown(),
          }).unknown(),
        },
      },
      handler: async (request, h) => {
        const {
          hook: { events },
          sender: {
            login: senderLogin
          },
          repository: {
            full_name: repositoryFullName
          },
        } = request.payload;

        if (events.includes('star')) {
          await axios.post(STREAMLABS_ENDPOINT, {
            access_token: config.STREAMLABS_TOKEN,
            type: 'follow',
            message: `*${senderLogin}* just starred *${repositoryFullName}*`,
          });

          return 'starring';
        }

        return {
          message: `Ignoring actions: '${events.join(',')}'`,
        };
      },
    }
  ]);

  return server;
};

module.exports = {
  initServer,
};
