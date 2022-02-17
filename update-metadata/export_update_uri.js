const fs = require('fs');
const readline = require("readline");

async function getReadline(msg) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(msg , function (value) {
        rl.close();
        resolve(value);
      });
    })
}

async function exportUpdateUri() {
    const mintListFilePath = await getReadline("Type the mint list json: ");
    let rawdata = fs.readFileSync(mintListFilePath);
    let mintList = JSON.parse(rawdata);

    const baseUri = await getReadline("Type the base uri: ");

    let content = [];

    for (let i = 0; i < mintList.length; i++) {
        let mintAddress = mintList[i];
        let item = {mint_account: mintAddress, new_uri: `${baseUri}/${mintAddress}.json`};
        content.push(item);
    }
    fs.writeFileSync(`update_all.json`, JSON.stringify(content));
}

exportUpdateUri();