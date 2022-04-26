# Earthstar Replica Server for Fly

This template will help you deploy an Earthstar replica server on Fly.io.

The interesting thing about Fly.io is how many instances of the same application
can be deployed around the world.

You can use this to deploy your own swarm of replica servers around the world,
which will sit behind the same URL. When someone connects to that URL they'll be
connected to the instance closest to them.

In the background, the instances will all sync with each other.

Note: Fly requires a credit card to sign up. If you just want something a bit
less involved,
[try the Glitch template instead](https://github.com/earthstar-project/replica-server-glitch).

## Initial deployment

1. [Install the `flyctl` command line tool](https://fly.io/docs/getting-started/installing-flyctl/)
2. Make an account: `flyctl auth signup`
3. Run `flyctl launch --no-deploy`. The command line will prompt you for a name
   for your app.
4. Run `flyctl volumes create share_data`. You'll be prompted for which region
   you'd like this first volume to be in.
5. (Optional) If you want to run a showcase server (where the contents of a
   share are exposed over the web), set the share you'd like to expose the
   contents of with `flyctl secrets set SOURCE_SHARE=+yoursharename.a123`.
6. `flyctl deploy --remote-only`
7. Check the logs at `flyctl logs`. There should be a message saying that the
   server is running and with the URL to sync from.

It depends on how many shares your replica server is syncing, but if syncing is
failing you may have to scale the amount of memory the server has. You can do
this with `flyctl scale memory 512`.

## Adding another replica server to another region

Every time you want to add another instance of a replica server, you'll need to
add a new volume with `flyctl volumes create share_data`. Each time you'll be
prompted to choose a region the new instance will be in.

## Running locally

You might want to make some changes and test them locally. You'll need to have
Deno installed to do it
([instructions here](https://deno.land/manual/getting_started/installation)).
You can do that by running the following:

```
deno task server
```
