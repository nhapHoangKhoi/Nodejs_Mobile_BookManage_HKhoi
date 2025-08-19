import { CronJob } from "cron";
import https from "https";

const job = new CronJob("*/14 * * * *", function () {
  https
    .get(`${process.env.API_URL}`, (res) => {
      if(res.statusCode === 200) {
        console.log("GET request sent successfully");
      } 
      else {
        console.log("GET request failed", res.statusCode);
      } 
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;

// Cron jobs are scheduled tasks that run periodically at fixed intervals
// we want to send 1 GET request for every 14 minutes
//
// cronTime: "* * * * * *"
// read document: https://classic.yarnpkg.com/en/package/cron