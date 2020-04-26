# webhook

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->

![license](https://img.shields.io/github/license/streamdevs/webhook.svg)
![Node.js CI](https://github.com/streamdevs/webhook/workflows/Node.js%20CI/badge.svg)

A webhook to forward GitHub events to StreamLabs Alerts and Twitch Chat.

![Apr-21-2020 9-18-24 PM](https://user-images.githubusercontent.com/7255298/79904917-bc816e00-8415-11ea-98ca-7525b169ef49.gif)

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

| Variable                  | Setting                                                                                                                                                                    | Mandatory | Default       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| PORT                      | Where the HTTP server should listen.                                                                                                                                       | No        | `8080`        |
| STREAMLABS_TOKEN          | A token to use the StreamLabs API. You can get one by using [StreamDevs/streamlabs-token](https://github.com/streamdevs/streamlabs-token)                                  | **Yes**   | _empty_       |
| TWITCH_BOT_NAME           | The account (username) that the chatbot uses to send chat messages.                                                                                                        | **Yes**   | _empty_       |
| TWITCH_BOT_TOKEN          | The token to authenticate your chatbot. Generate this with https://twitchapps.com/tmi/, while logged in to your chatbot account. The token will be an alphanumeric string. | **Yes**   | _empty_       |
| TWITCH_BOT_CHANNEL        | The Twitch channel name where you want to run the bot. Usually this is your main Twitch account.                                                                           | **Yes**   | _empty_       |
| NOTIFY_ISSUES_ASSIGNED_TO | A comma-separated list of GitHub user names. Only issues assigned to these users will be notified or leave it empty to receive all notifications.                          | **No**    | _empty array_ |

## Contributing

Everyone is welcome to contribute to this repository. To do so follow these steps:

- Open an [Issue](https://github.com/streamdevs/webhook/issues) with your idea and label it using the `idea` tag
- Open a [pull request](https://github.com/streamdevs/webhook/pulls) and reference your original issue
- Make sure your PR includes proper tests
- Be on the lookout for requested changes or clarifications during the Code Review
- Once your PR is reviewed and merged, we'll add you to [the contributors list](#contributors-)

### Deploying to Heroku

You can use the "[deploy to Heroku](#webhook)" button link at the top of this readme file or use the Heroku CLI

### Configuring your local repo to deploy on Heroku

- Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- Log in to Heroku with `heroku login`
- Open the Heroku dashboard for your app
- Go to the settings tab
- Under **App Information**, copy the **Heroku git Url**
- Add a new git remote with `git remote add heroku your-https-git-repo-goes-here`

### Deploying changes to a Heroku app using the CLI

Push to the master branch on Heroku with `git push heroku master`

Note that you can deploy a different branch to Heroku, but it will only deploy the remote master branch. To deploy a
local branch you can run `git push heroku your-branch-here:master` so that your branch overrides the _master_ branch on Heroky.

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
    <td align="center"><a href="https://github.com/Llambi"><img src="https://avatars3.githubusercontent.com/u/15263323?v=4" width="100px;" alt=""/><br /><sub><b>Hugo Perez Fernandez</b></sub></a><br /><a href="https://github.com/streamdevs/webhook/commits?author=Llambi" title="Code">💻</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
