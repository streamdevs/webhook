# webhook

![license](https://img.shields.io/github/license/streamdevs/webhook.svg)
![Node.js CI](https://github.com/streamdevs/webhook/workflows/Node.js%20CI/badge.svg)

A webhook to forward GitHub events to StreamLabs custom messages

## Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Manual deploy

```
git clone https://github.com/streamdevs/webhook.git
cd webhook
yarn
yarn start
```

## Configuration

If they're present, we make use of the following environment variables:

| Variable         | Setting                                                         | Default |
|------------------|-----------------------------------------------------------------|---------|
| PORT             | Where the HTTP server should listen.                            | `8080`  |
| STREAMLABS_TOKEN | A token to use the StreamLabs API.                              | *empty* |

