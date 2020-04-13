# webhook

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->

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

We make use of the following environment variables:

| Variable          | Setting                                                                                                                                                                    | Mandatory | Default |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| PORT              | Where the HTTP server should listen.                                                                                                                                       | No        | `8080`  |
| STREAMLABS_TOKEN  | A token to use the StreamLabs API.                                                                                                                                         | **Yes**   | _empty_ |
| TWITCH_BOT_NAME   | The account (username) that the chatbot uses to send chat messages.                                                                                                        | **Yes**   | _empty_ |
| TWITCH_BOT_TOKEN  | The token to authenticate your chatbot. Generate this with https://twitchapps.com/tmi/, while logged in to your chatbot account. The token will be an alphanumeric string. | **Yes**   | _empty_ |
| TWITCH_BOT_CHANEL | The Twitch channel name where you want to run the bot. Usually this is your main Twitch account.                                                                           | **Yes**   | _empty_ |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://orestes.io"><img src="https://avatars2.githubusercontent.com/u/618107?v=4" width="100px;" alt=""/><br /><sub><b>Orestes Carracedo</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=orestes" title="Code">💻</a></td>
    <td align="center"><a href="http://santiagomartin.dev"><img src="https://avatars2.githubusercontent.com/u/7255298?v=4" width="100px;" alt=""/><br /><sub><b>Santi</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=SantiMA10" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hugolesta"><img src="https://avatars2.githubusercontent.com/u/6575715?v=4" width="100px;" alt=""/><br /><sub><b>hugolesta</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=hugolesta" title="Code">💻</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
