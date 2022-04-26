import { Earthstar, Rpc, Server } from "./deps.ts";

const FLY_APP_NAME = Deno.env.get("FLY_APP_NAME");

export async function getInstanceURLs(): Promise<Set<string>> {
  if (!FLY_APP_NAME) {
    // This is being run locally, not on Fly. Abort here.
    return new Set();
  }

  const nets = Deno.networkInterfaces();

  const internalIpv6s = nets.filter((netInterface) => {
    return netInterface.family === "IPv6";
  }).map((netInterface) => {
    return netInterface.address;
  });

  try {
    const ipv6s = await Deno.resolveDns(`${FLY_APP_NAME}.internal`, "AAAA");

    const transformed = ipv6s
      .filter((ip) => !internalIpv6s.includes(ip))
      .map((ip) => `ws://[${ip}]:8080/earthstar-api/v2`);

    return new Set(transformed);
  } catch {
    return new Set();
  }
}

export class ExtensionSyncFlyInstances
  implements Server.IReplicaServerExtension {
  async register(peer: Earthstar.Peer) {
    const otherInstanceURLs = await getInstanceURLs();

    if (otherInstanceURLs.size > 0) {
      const syncer = new Earthstar.Syncer(peer, (methods) => {
        return new Rpc.TransportWebsocketClient({
          deviceId: `instance-${Deno.env.get("FLY_ALLOC_ID")}`,
          methods,
        });
      });

      otherInstanceURLs.forEach((url) => {
        console.log(`Started syncing with another instance: ${url}`);

        syncer.transport.addConnection(url);
      });
    }
  }

  handler() {
    return Promise.resolve(null);
  }
}
