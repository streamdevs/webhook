const { Server } = require("@hapi/hapi");

// TODO: Validate arguments before starting

const config = {
  STREAMLABS_TOKEN: process.env["STREAMLABS_TOKEN"],
  port: process.env["PORT"] || process.env["HTTP_PORT"] || 8080,
};

const initServer = (config) => {
  const server = new Server({
    port: config.port,
  });

  return server;
};

initServer(config);

module.exports = {
  initServer,
};
