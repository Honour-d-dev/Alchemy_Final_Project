export const EscrowAbi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ExcCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ExcClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ExcCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OTCApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OTCCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OTCClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OTCCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OTCRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "TLClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "TLCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "approveOTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "cancelExc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "cancelOTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "claimExc",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "claimOTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "claimTL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "depoToken",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "beneToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "dAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bAmount",
        type: "uint256",
      },
    ],
    name: "createExc",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_arbiter",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createOTC",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "benficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createTL",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEscrows",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "arbiter",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "confirms",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "revokes",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "quorum",
            type: "uint8",
          },
        ],
        internalType: "struct OTC.OTCEscrow[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeLock",
            type: "uint256",
          },
        ],
        internalType: "struct TL.TLEscrow[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "dToken",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "bToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "dAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bAmount",
            type: "uint256",
          },
        ],
        internalType: "struct EXC.ExcEscrow[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExcEscrows",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "dToken",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "bToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "dAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bAmount",
            type: "uint256",
          },
        ],
        internalType: "struct EXC.ExcEscrow[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOTCEscrows",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "arbiter",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "confirms",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "revokes",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "quorum",
            type: "uint8",
          },
        ],
        internalType: "struct OTC.OTCEscrow[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTLEscrow",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeLock",
            type: "uint256",
          },
        ],
        internalType: "struct TL.TLEscrow[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasApprovedOTC",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasRevokedOTC",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "revokeOTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "s_ExcCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_ExcEscrows",
    outputs: [
      {
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "dToken",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "bToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "dAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_OTCEscrows",
    outputs: [
      {
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "confirms",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "revokes",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "quorum",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_OTCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_TLCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_TLEscrows",
    outputs: [
      {
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeLock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
