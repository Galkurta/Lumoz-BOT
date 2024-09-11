const fs = require("fs");
const path = require("path");
const axios = require("axios");
const readline = require("readline");
const log = require("loglevel");
const prefix = require("loglevel-plugin-prefix");

class Lumoz {
  constructor() {
    this.headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language":
        "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Origin: "https://quidditch.lumoz.org",
      Referer: "https://quidditch.lumoz.org/",
      "Sec-Ch-Ua":
        '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    };

    this.setupLogging();
  }

  setupLogging() {
    log.setLevel("info");

    const colors = {
      INFO: "\x1b[36m", // Cyan
      WARN: "\x1b[33m", // Yellow
      ERROR: "\x1b[31m", // Red
    };

    prefix.reg(log);
    prefix.apply(log, {
      format(level, name, timestamp) {
        return `${colors[level.toUpperCase()]}${level}\x1b[0m`;
      },
    });
  }

  async countdown(seconds) {
    const startTime = Date.now();
    const endTime = startTime + seconds * 1000;

    while (Date.now() < endTime) {
      const remainingSeconds = Math.ceil((endTime - Date.now()) / 1000);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Wait ${remainingSeconds} seconds to continue...`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
  }

  encodeToBase64(str) {
    return Buffer.from(str).toString("base64");
  }

  async getUserInfo(authorization) {
    const url = "https://quidditch-api.lumoz.org/api/quidditch/user_info";
    const headers = { ...this.headers, Authorization: authorization };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      log.error(`Error getting user info: ${error.message}`);
      return null;
    }
  }

  async getNewUserGift(authorization, invitationCode) {
    const url = `https://quidditch-api.lumoz.org/api/quidditch/new_user_gift?invitation_code=${invitationCode}`;
    const headers = { ...this.headers, Authorization: authorization };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      log.error(`Error getting new user gift: ${error.message}`);
      return null;
    }
  }

  async getCollectInfo(authorization) {
    const url = "https://quidditch-api.lumoz.org/api/quidditch/collect_info";
    const headers = { ...this.headers, Authorization: authorization };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      log.error(`Error getting collect info: ${error.message}`);
      return null;
    }
  }

  async collectReward(authorization, item, amount) {
    const url = `https://quidditch-api.lumoz.org/api/quidditch/collect?collect_item=${item}&collect_amount=${amount}`;
    const headers = { ...this.headers, Authorization: authorization };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      log.error(`Failed to receive ${item}: ${error.message}`);
      return null;
    }
  }

  async main() {
    const dataFile = path.join(__dirname, "data.txt");
    const data = fs
      .readFileSync(dataFile, "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

    while (true) {
      for (let i = 0; i < data.length; i++) {
        const rawAuthorization = data[i];
        const authorization = this.encodeToBase64(rawAuthorization);
        const userData = JSON.parse(
          decodeURIComponent(rawAuthorization.split("user=")[1].split("&")[0])
        );

        log.info(`[ Account ${i + 1} | ${userData.username} ]`);

        let userInfo = await this.getUserInfo(authorization);
        if (!userInfo) continue;

        if (!userInfo.is_exist) {
          const giftResult = await this.getNewUserGift(authorization, "UAXHC");
          if (
            giftResult &&
            giftResult.describe ==
              "You have got golden snitch gift successfully."
          ) {
            log.info("Received golden snitch gift");
          }
          userInfo = await this.getUserInfo(authorization);
        }

        if (userInfo.is_exist) {
          const collectInfo = await this.getCollectInfo(authorization);
          if (collectInfo) {
            log.info(
              `Points: ${userInfo.points} | Snitch: ${userInfo.snitch} | Stone: ${userInfo.stone}`
            );
            log.info(
              `Available Snitch: ${
                collectInfo.available_snitch
              } | Available USDT: ${collectInfo.usdt.toFixed(6)}`
            );

            if (collectInfo.usdt > 0) {
              const usdtAmount = Math.floor(collectInfo.usdt * 1000000);
              const usdtResult = await this.collectReward(
                authorization,
                "usdt",
                usdtAmount
              );
              if (
                usdtResult &&
                usdtResult.describe == "Collect usdt successfully."
              ) {
                log.info(`Collected USDT: ${usdtAmount / 1000000}`);
              }
            }

            if (collectInfo.available_snitch > 0) {
              const randomPercentage = Math.random() * (0.9 - 0.7) + 0.7;
              const totalCollect = Math.floor(
                collectInfo.available_snitch * randomPercentage
              );
              log.info(
                `Collecting ${(randomPercentage * 100).toFixed(2)}% of ${
                  collectInfo.available_snitch
                } available snitch`
              );

              let collected = 0;
              for (let j = 0; j < 3; j++) {
                const remainingToCollect = totalCollect - collected;
                if (remainingToCollect <= 0) break;

                const amountToCollect =
                  j == 2
                    ? remainingToCollect
                    : Math.floor(Math.random() * remainingToCollect);
                const snitchResult = await this.collectReward(
                  authorization,
                  "snitch",
                  amountToCollect
                );
                if (snitchResult) {
                  collected += amountToCollect;
                  log.info(`Collected Snitch: ${collected}/${totalCollect}`);
                }

                if (j < 2) await this.countdown(5);
              }
            }
          }
        }

        if (i < data.length - 1) await this.countdown(5);
      }

      await this.countdown(60);
    }
  }
}

const client = new Lumoz();
client.main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
