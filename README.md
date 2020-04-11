# webhook
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://orestes.io"><img src="https://avatars2.githubusercontent.com/u/618107?v=4" width="100px;" alt=""/><br /><sub><b>Orestes Carracedo</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=orestes" title="Code">💻</a></td>
    <td align="center"><a href="http://santiagomartin.dev"><img src="https://avatars2.githubusercontent.com/u/7255298?v=4" width="100px;" alt=""/><br /><sub><b>Santi</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=SantiMA10" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!