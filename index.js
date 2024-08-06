const { Client } = require("discord.js-selfbot-v13");
const { setTimeout: sleep } = require("node:timers/promises");
const { readFileSync } = require('node:fs')

const TOKENS = readFileSync('./tokens.txt', { encoding: 'utf8' }).split('\n').map(i => i.trim());
const SERVER_ID = "1252504323485859900";
// Thời gian nghỉ mỗi lần spam (số giây x1000).
const SLEEP_TIMER = 5;
const CONTENT = readFileSync('./content.txt', { encoding: 'utf8' });

(async () => {
    const clients = TOKENS.map((i) => {
        const c = new Client();
        c.login(i);
        return c;
    });

    clients.forEach((client) =>
        client.once("ready", async () => {
            const targetGuild = await client.guilds.fetch(SERVER_ID);
            const availableChannels = targetGuild.channels.cache.filter(
                (i) => i.permissionsFor(client.user.id).has(["SEND_MESSAGES", "VIEW_CHANNEL"]) && i.isText()
            );

            while (true) {
                await sleep(SLEEP_TIMER);

                availableChannels.forEach((i) => {
                    i.send(CONTENT).catch(() => null);
                });
            }
        })
    );
})();