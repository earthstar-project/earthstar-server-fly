FROM denoland/deno:1.21.0

EXPOSE 8080
EXPOSE 443

WORKDIR /app

RUN mkdir /app/data/ \
	&& chown deno:deno /app/data/
	
VOLUME [ "/app/data" ]

COPY deps.ts ./deps.ts
COPY extension_sync_fly_instances.ts ./extension_sync_fly_instances.ts
COPY server.ts ./server.ts
COPY known_shares.json ./known_shares.json

USER deno

RUN deno cache --unstable --no-check=remote server.ts
CMD ["run", "--unstable", "--allow-all", "--no-check", "server.ts"]