import * as Earthstar from "https://deno.land/x/earthstar@v10.0.0/mod.ts";
import { DocDriverSqliteFfi } from "https://deno.land/x/earthstar@v10.0.0/src/replica/doc_drivers/sqlite_ffi.ts";

// If FLY_APP_NAME isn't set, we're running locally.
const FLY_APP_NAME = Deno.env.get("FLY_APP_NAME");

// Start the server.
console.log("Starting up server...");
new Earthstar.Server([
  // Populate with shares from the a known shares list.
  new Earthstar.ExtensionKnownShares({
    knownSharesPath: "known_shares.json",
    onCreateReplica: (shareAddress) => {
      return new Earthstar.Replica(
        {
          driver: {
            docDriver: new DocDriverSqliteFfi({
              share: shareAddress,
              filename: `./data/${shareAddress}.sql`,
              mode: "create-or-open",
            }),
            attachmentDriver: new Earthstar.AttachmentDriverFilesystem(
              `./data/${shareAddress}_attachments`,
            ),
          },
        },
      );
    },
  }),
  // Add websocket syncing at /earthstar-api/v2
  new Earthstar.ExtensionSyncWeb({
    path: "/sync",
  }),
], { port: 8080 });

// Use the presence of FLY_APP_NAME to figure out the URL for this server.
const hostname = FLY_APP_NAME
  ? `wss://${FLY_APP_NAME}.fly.dev/`
  : "ws://localhost:8080/";

// Log a helpful message about where to sync.
console.log(`Sync with this server at ${hostname}sync`);
