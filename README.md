# Earthstar Replica Server for Fly

This template will help you deploy an Earthstar server on Fly.io. The server
will run on the Deno runtime.

If you'd like to further customise your server, you can learn more about servers
and their extensions at the
[main Earthstar repo](https://github.com/earthstar-project/earthstar/blob/main/README_SERVERS.md).

Note: Fly requires a credit card to sign up. If you just want something a bit
less involved,
[try the Glitch template instead](https://github.com/earthstar-project/replica-server-glitch).

## Initial deployment

1. Create a new file called `known_shares.json` in the root of this project. Add
   the public addresses of the shares you'd like your server to replicate as an
   array of strings (e.g. `["+one.xxx", "two.xxx"]`).
2. [Install the `fly` command line tool](https://fly.io/docs/getting-started/installing-flyctl/)
3. Make an account: `fly auth signup`
4. Run `fly launch --no-deploy`. The command line will prompt you for a name for
   your app.
5. Run `fly volumes create share_data`. You'll be prompted for which region
   you'd like this first volume to be in.
6. `fly deploy --remote-only`
7. Check the logs at `fly logs`. There should be a message saying that the
   server is running and with the URL to sync from.

## Running locally

You might want to make some changes and test them locally. You'll need to have
Deno installed to do it
([instructions here](https://deno.land/manual/getting_started/installation)).
You can do that by running the following:

```
deno task server
```
