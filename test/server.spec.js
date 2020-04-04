const { initServer } = require("../src/server");
const axios = require("axios");

describe("server", () => {
  describe("POST /github", () => {
    const config = { port: 8080 };

    it("returns 400 on requests without payload", async () => {
      const subject = initServer(config);

      const { statusCode } = await subject.inject({
        method: "POST",
        url: "/github",
      });

      expect(statusCode).toBe(400);
    });

    it("handles unknown actions gracefully", async () => {
      const subject = initServer(config);

      const { statusCode, result } = await subject.inject({
        method: "POST",
        url: "/github",
        headers: {'Content-Type': 'application/json'},
        payload: {
          hook: {events: ['created']},
          sender: {
            login: 'user'
          },
          repository: {
            full_name: 'org/repo'
          },
        },
      });

      expect(statusCode).toBe(200);
      expect(result).toEqual({message: `Ignoring actions: 'created'`});
  });

    it("Understands the GitHub event format for 'star' events", async () => {
      const subject = initServer(config);
      const spy = jest.spyOn(axios, 'post');
      spy.mockImplementationOnce(() => {});

      const repositoryFullName = 'streamdevs/webhook', senderLogin = 'orestes';

      await subject.inject({
        method: "POST",
        url: "/github",
        headers: {'Content-Type': 'application/json'},
        payload: {
          "zen": "Anything added dilutes everything else.",
          "hook_id": 198093410,
          "hook": {
            "type": "Repository",
            "id": 198093410,
            "name": "web",
            "active": true,
            "events": [
              "star"
            ],
            "config": {
              "content_type": "form",
              "insecure_ssl": "0",
              "url": "https://streamdevs-webhook.herokuapp.com/github"
            },
            "updated_at": "2020-04-04T18:49:46Z",
            "created_at": "2020-04-04T18:49:46Z",
            "url": "https://api.github.com/repos/streamdevs/webhook/hooks/198093410",
            "test_url": "https://api.github.com/repos/streamdevs/webhook/hooks/198093410/test",
            "ping_url": "https://api.github.com/repos/streamdevs/webhook/hooks/198093410/pings",
            "last_response": {
              "code": null,
              "status": "unused",
              "message": null
            }
          },
          "repository": {
            "id": 253047588,
            "node_id": "MDEwOlJlcG9zaXRvcnkyNTMwNDc1ODg=",
            "name": "webhook",
            "full_name": repositoryFullName,
            "private": false,
            "owner": {
              "login": "streamdevs",
              "id": 63160962,
              "node_id": "MDEyOk9yZ2FuaXphdGlvbjYzMTYwOTYy",
              "avatar_url": "https://avatars3.githubusercontent.com/u/63160962?v=4",
              "gravatar_id": "",
              "url": "https://api.github.com/users/streamdevs",
              "html_url": "https://github.com/streamdevs",
              "followers_url": "https://api.github.com/users/streamdevs/followers",
              "following_url": "https://api.github.com/users/streamdevs/following{/other_user}",
              "gists_url": "https://api.github.com/users/streamdevs/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/streamdevs/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/streamdevs/subscriptions",
              "organizations_url": "https://api.github.com/users/streamdevs/orgs",
              "repos_url": "https://api.github.com/users/streamdevs/repos",
              "events_url": "https://api.github.com/users/streamdevs/events{/privacy}",
              "received_events_url": "https://api.github.com/users/streamdevs/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "html_url": "https://github.com/streamdevs/webhook",
            "description": "A webhook to forward GitHub events to StreamLabs custom messages",
            "fork": false,
            "url": "https://api.github.com/repos/streamdevs/webhook",
            "forks_url": "https://api.github.com/repos/streamdevs/webhook/forks",
            "keys_url": "https://api.github.com/repos/streamdevs/webhook/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/streamdevs/webhook/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/streamdevs/webhook/teams",
            "hooks_url": "https://api.github.com/repos/streamdevs/webhook/hooks",
            "issue_events_url": "https://api.github.com/repos/streamdevs/webhook/issues/events{/number}",
            "events_url": "https://api.github.com/repos/streamdevs/webhook/events",
            "assignees_url": "https://api.github.com/repos/streamdevs/webhook/assignees{/user}",
            "branches_url": "https://api.github.com/repos/streamdevs/webhook/branches{/branch}",
            "tags_url": "https://api.github.com/repos/streamdevs/webhook/tags",
            "blobs_url": "https://api.github.com/repos/streamdevs/webhook/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/streamdevs/webhook/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/streamdevs/webhook/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/streamdevs/webhook/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/streamdevs/webhook/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/streamdevs/webhook/languages",
            "stargazers_url": "https://api.github.com/repos/streamdevs/webhook/stargazers",
            "contributors_url": "https://api.github.com/repos/streamdevs/webhook/contributors",
            "subscribers_url": "https://api.github.com/repos/streamdevs/webhook/subscribers",
            "subscription_url": "https://api.github.com/repos/streamdevs/webhook/subscription",
            "commits_url": "https://api.github.com/repos/streamdevs/webhook/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/streamdevs/webhook/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/streamdevs/webhook/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/streamdevs/webhook/issues/comments{/number}",
            "contents_url": "https://api.github.com/repos/streamdevs/webhook/contents/{+path}",
            "compare_url": "https://api.github.com/repos/streamdevs/webhook/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/streamdevs/webhook/merges",
            "archive_url": "https://api.github.com/repos/streamdevs/webhook/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/streamdevs/webhook/downloads",
            "issues_url": "https://api.github.com/repos/streamdevs/webhook/issues{/number}",
            "pulls_url": "https://api.github.com/repos/streamdevs/webhook/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/streamdevs/webhook/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/streamdevs/webhook/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/streamdevs/webhook/labels{/name}",
            "releases_url": "https://api.github.com/repos/streamdevs/webhook/releases{/id}",
            "deployments_url": "https://api.github.com/repos/streamdevs/webhook/deployments",
            "created_at": "2020-04-04T16:36:40Z",
            "updated_at": "2020-04-04T18:45:44Z",
            "pushed_at": "2020-04-04T18:45:42Z",
            "git_url": "git://github.com/streamdevs/webhook.git",
            "ssh_url": "git@github.com:streamdevs/webhook.git",
            "clone_url": "https://github.com/streamdevs/webhook.git",
            "svn_url": "https://github.com/streamdevs/webhook",
            "homepage": "https://github.com/streamdevs/webhook",
            "size": 66,
            "stargazers_count": 1,
            "watchers_count": 1,
            "language": "JavaScript",
            "has_issues": true,
            "has_projects": true,
            "has_downloads": true,
            "has_wiki": true,
            "has_pages": false,
            "forks_count": 0,
            "mirror_url": null,
            "archived": false,
            "disabled": false,
            "open_issues_count": 0,
            "license": {
              "key": "cc-by-4.0",
              "name": "Creative Commons Attribution 4.0 International",
              "spdx_id": "CC-BY-4.0",
              "url": "https://api.github.com/licenses/cc-by-4.0",
              "node_id": "MDc6TGljZW5zZTI1"
            },
            "forks": 0,
            "open_issues": 0,
            "watchers": 1,
            "default_branch": "master"
          },
          "sender": {
            "login": senderLogin,
            "id": 7255298,
            "node_id": "MDQ6VXNlcjcyNTUyOTg=",
            "avatar_url": "https://avatars2.githubusercontent.com/u/7255298?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/SantiMA10",
            "html_url": "https://github.com/SantiMA10",
            "followers_url": "https://api.github.com/users/SantiMA10/followers",
            "following_url": "https://api.github.com/users/SantiMA10/following{/other_user}",
            "gists_url": "https://api.github.com/users/SantiMA10/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/SantiMA10/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/SantiMA10/subscriptions",
            "organizations_url": "https://api.github.com/users/SantiMA10/orgs",
            "repos_url": "https://api.github.com/users/SantiMA10/repos",
            "events_url": "https://api.github.com/users/SantiMA10/events{/privacy}",
            "received_events_url": "https://api.github.com/users/SantiMA10/received_events",
            "type": "User",
            "site_admin": false
          }
        },
      });

      let expectedPayload = {
        access_token: config.STREAMLABS_TOKEN,
        type: 'follow',
        message: `*${senderLogin}* just starred *${repositoryFullName}*`,
      };

      expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
  });

  });
});
