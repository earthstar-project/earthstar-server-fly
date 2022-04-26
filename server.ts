import { Earthstar, Server } from "./deps.ts";
import { ExtensionSyncFlyInstances } from "./extension_sync_fly_instances.ts";

// Make sure to set this in your secrets with `flyctl secrets set`
const SOURCE_SHARE = Deno.env.get("SOURCE_SHARE");

// If FLY_APP_NAME isn't set, we're running locally.
const FLY_APP_NAME = Deno.env.get("FLY_APP_NAME");

console.log("Creating extensions...");
const extensions: Server.IReplicaServerExtension[] = [
  // Populate with shares from the a known shares list.
  new Server.ExtensionKnownShares({
    knownSharesPath: "known_shares.json",
    onCreateReplica: (shareAddress) => {
      return new Earthstar.Replica(
        shareAddress,
        Earthstar.FormatValidatorEs4,
        new Earthstar.ReplicaDriverSqlite({
          filename: `data/${shareAddress}.sqlite`,
          mode: "create-or-open",
          share: shareAddress,
        }),
      );
    },
  }),
  // Add websocket syncing at /earthstar-api/v2
  new Server.ExtensionSyncWebsocket({
    path: "/earthstar-api/v2",
  }),
  // Sync with other fly instances of this app.
  new ExtensionSyncFlyInstances(),
];

// If a SOURCE_SHARE is set, add the extension to serve content from it.
if (SOURCE_SHARE) {
  extensions.push(
    new Server.ExtensionServeContent({ sourceShare: SOURCE_SHARE }),
  );
}

// Start the server.
console.log("Starting up server...");
new Server.ReplicaServer(extensions, { port: 8080 });

// Use the presence of FLY_APP_NAME to figure out the URL for this server.
const hostname = FLY_APP_NAME
  ? `wss://${FLY_APP_NAME}.fly.dev/`
  : "ws://localhost:8080/";

// Log a helpful message about where to sync.
console.log(`Sync with this server at ${hostname}/earthstar-api/v2`);
