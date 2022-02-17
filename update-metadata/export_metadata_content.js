const fs = require('fs');
const path = require('path');
var request = require('request');

async function exportMetadataContent() {

    const directory = './mints';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
		
        let index = 0;
        for (const file of files) {
            let rawMint = fs.readFileSync(path.join(directory, file));
            let mint = JSON.parse(rawMint);
            let pubkey = mint.mint;
            let url = mint.data.uri;

            var options = {
                url,
                method: 'GET',
            };

            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let metadata = JSON.parse(body);
					metadata.external_url = '';
                    const content = JSON.stringify(metadata);
                    fs.writeFileSync(`./export/${pubkey}.json`, content);
                    console.log('File index:', index++);
                }
            });
        }
    });
}

exportMetadataContent();
