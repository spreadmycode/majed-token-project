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
          "name": "rewardMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": true,
          "isSigner": true
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
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rewardLegendAmount",
          "type": "u64"
        },
        {
          "name": "periodLegend",
          "type": "i64"
        },
        {
          "name": "stakeLegendSymbol",
          "type": "string"
        },
        {
          "name": "periodToken",
          "type": "i64"
        },
        {
          "name": "apr",
          "type": "i64"
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
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardLegendAmount",
          "type": "u64"
        },
        {
          "name": "periodLegend",
          "type": "i64"
        },
        {
          "name": "stakeLegendSymbol",
          "type": "string"
        },
        {
          "name": "periodToken",
          "type": "i64"
        },
        {
          "name": "apr",
          "type": "i64"
        }
      ]
    },
    {
      "name": "stakeLegend",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
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
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeLegend",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimLegend",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stakeToken",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
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
        },
        {
          "name": "clock",
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
      "name": "unstakeToken",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
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
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "depositToken",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
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
        },
        {
          "name": "clock",
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
      "name": "claimToken",
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
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
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
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "rewardAccount",
            "type": "publicKey"
          },
          {
            "name": "rewardLegendAmount",
            "type": "u64"
          },
          {
            "name": "periodLegend",
            "type": "i64"
          },
          {
            "name": "stakeLegendSymbol",
            "type": "string"
          },
          {
            "name": "periodToken",
            "type": "i64"
          },
          {
            "name": "stakeTokenApr",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "StakeLegendData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstaked",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "account",
            "type": "publicKey"
          },
          {
            "name": "stakeTime",
            "type": "i64"
          },
          {
            "name": "unstakeTime",
            "type": "i64"
          },
          {
            "name": "withdrawnNumber",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "StakeTokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstaked",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "account",
            "type": "publicKey"
          },
          {
            "name": "stakeTime",
            "type": "i64"
          },
          {
            "name": "depositTime",
            "type": "i64"
          },
          {
            "name": "unstakeTime",
            "type": "i64"
          },
          {
            "name": "claimTime",
            "type": "i64"
          },
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "pastRewardAmount",
            "type": "u64"
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
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6005,
      "name": "InvalidMetadata",
      "msg": "Invalid metadata"
    },
    {
      "code": 6006,
      "name": "InvalidStakeData",
      "msg": "Invalid stakedata account"
    },
    {
      "code": 6007,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6008,
      "name": "InvalidPeriod",
      "msg": "Invalid Period"
    },
    {
      "code": 6009,
      "name": "AlreadyUnstaked",
      "msg": "Already unstaked"
    },
    {
      "code": 6010,
      "name": "InvalidOwner",
      "msg": "You are not Pool owner"
    },
    {
      "code": 6011,
      "name": "CooldownLocked",
      "msg": "Cooldown locked"
    }
  ]
};