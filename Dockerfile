FROM denoland/deno:1.30.0

EXPOSE 8080
EXPOSE 443

WORKDIR /app

RUN mkdir /app/data/ \
	&& chown deno:deno /app/data/
	
VOLUME [ "/app/data" ]

COPY server.ts ./server.ts
COPY known_shares.json ./known_shares.json

USER deno

CMD ["run", "--unstable", "--allow-all", "server.ts"]
