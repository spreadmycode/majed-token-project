export const IDL = 

{
  "version": "0.1.0",
  "name": "solana_anchor",
  "instructions": [
    {
      "name": "initPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rand",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "rand",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "tokenPrice",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TokenMintToFailed",
      "msg": "Token mint to failed"
    },
    {
      "code": 6001,
      "name": "TokenSetAuthorityFailed",
      "msg": "Token set authority failed"
    },
    {
      "code": 6002,
      "name": "TokenTransferFailed",
      "msg": "Token transfer failed"
    },
    {
      "code": 6003,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6004,
      "name": "InsufficientFunds",
      "msg": "Insufficient Pool Funds"
    },
    {
      "code": 6005,
      "name": "InvalidOwner",
      "msg": "You are not Pool owner"
    }
  ]
};