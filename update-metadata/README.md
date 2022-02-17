# Update the metadata of bulk NFT

## 1. Get mints hash list

```
$ metaboss -r <RPC_NODE> snapshot mints --candy-machine-id <CANDY_MACHINE_ID> --output <OUTPUT_DIR>
```

Then it will export the mints hash list json file.

## 2. Decode the metadata from mints hash list

```
$ metaboss -r <RPC_NODE> decode mint --list-file <MINT_HASH_LIST_JSON_FILE_PATH> -o <OUPUT_DIRECTORY>
```

This command will export metadata content into specificed output folder for each mint address.

## 3. Export the full metadata content from decoded one

Create folder `mints` and copy all of previous result files and paste them on this folder.

Create folder `export` on current path.

Edit the code which starts from `/update-metadata/export_metadata_content.js: 25ln` to update the metadata for your requirements.

```
$ node export_metadata_content.js
```

This command will export the fully updated metadata json files to `export` folder.

## 4. Upload all files of `export` to IPFS and get the base url of IPFS folder

## 5. Generate the updating util json file

```
$ node export_update_uri.js
```

This will require mint hash list json file path and IPFSS base url.

Please input the absolute path of mint hash list json file (You got that file in step 1.).

Also input the base url which you got in step 4.

Then it will generate the file called `update_all.json` in current path.

## 6. Update all metadata of NFTs

```
$ metaboss -r <RPC_NODE> update uri-all --keypair <PATH_TO_UPDATE_AUTHORITY_KEYPAIR> --json-file <PATH_TO_update_all.json>
```

Please make sure that update authority wallet has sufficient funds before running command.

This command will fail on some updates.

Check the dump on console and find all of failed updates.

Then update the `update_all.json` with failed updates and retry command.
