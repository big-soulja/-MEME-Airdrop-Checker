require("dotenv").config();
const ethers = require("ethers");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// change this to 1 for want captainz and 2 for potatoz
const collectionID = 2;

async function main() {
  const nftPromises = [];
  let unclaimed = 0;
  let unclaimedAmmount = 0;
  for (let i = 0; i < 9998; i++) {
    nftPromises.push(
      (async () => {
        const [claimableAmount, time] =
          await contractInstance.getRewardsClaimInfoByNFT(collectionID, i);
        console.log("Tokens to claim: " + claimableAmount);
        if (claimableAmount > 0) {
          unclaimed++;
          console.log(`index ${i} has something`);
          unclaimedAmmount += claimableAmount;
        }
      })()
    );

    if (nftPromises.length >= 100) {
      await Promise.all(nftPromises);
      nftPromises.length = 0;
    }
  }

  await Promise.all(nftPromises);
  console.log("=====");
  console.log(
    `There are ${unclaimed} unclaimed airdrops in this collection, totalling ${unclaimedAmmount} tokens`
  );
}

// ABI from proxy contract
const contractABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "AlreadyDeposited", type: "error" },
  { inputs: [], name: "AlreadyWithdrawn", type: "error" },
  { inputs: [], name: "ClaimNotAvailable", type: "error" },
  { inputs: [], name: "ClaimNotClosed", type: "error" },
  { inputs: [], name: "ClaimTokenZeroAddress", type: "error" },
  { inputs: [], name: "InvalidClaimSetup", type: "error" },
  { inputs: [], name: "InvalidCollectionId", type: "error" },
  { inputs: [], name: "InvalidDelegate", type: "error" },
  { inputs: [], name: "InvalidWithdrawalSetup", type: "error" },
  { inputs: [], name: "MismatchedArrays", type: "error" },
  { inputs: [], name: "NFTRewardsNotExpired", type: "error" },
  { inputs: [], name: "NoClaimableToken", type: "error" },
  { inputs: [], name: "Uint128Overflow", type: "error" },
  { inputs: [], name: "Unauthorized", type: "error" },
  { inputs: [], name: "UpgraderRenounced", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "claimActive",
        type: "bool",
      },
    ],
    name: "ClaimStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimStartDate",
        type: "uint256",
      },
    ],
    name: "ClaimTokenDepositedAndClaimStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimedAt",
        type: "uint256",
      },
    ],
    name: "ClaimedInNFTs",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalWithdrawn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawnAt",
        type: "uint256",
      },
    ],
    name: "UnclaimedNFTRewardsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newUpgrader",
        type: "address",
      },
    ],
    name: "UpgraderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimedAt",
        type: "uint256",
      },
    ],
    name: "UserClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_additionalNFTUnlockedBP",
        type: "uint64",
      },
      { internalType: "uint128", name: "_newUnlockTimestamp", type: "uint128" },
    ],
    name: "addNFTUnlockedBPAndSetUnlockTs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      {
        internalType: "enum ClaimType[]",
        name: "_claimTypes",
        type: "uint8[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_requester", type: "address" },
      {
        internalType: "enum ClaimType[]",
        name: "_claimTypes",
        type: "uint8[]",
      },
    ],
    name: "claimFromMulti",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "collectionId", type: "uint256" },
          { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
          {
            internalType: "bool[]",
            name: "withNFTAirdropList",
            type: "bool[]",
          },
          {
            internalType: "bool[]",
            name: "withNFTRewardsList",
            type: "bool[]",
          },
        ],
        internalType: "struct NFTCollectionClaimRequest[]",
        name: "_nftCollectionClaimRequests",
        type: "tuple[]",
      },
      { internalType: "bool", name: "_withWalletRewards", type: "bool" },
    ],
    name: "claimInNFTs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_requester", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "collectionId", type: "uint256" },
          { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
          {
            internalType: "bool[]",
            name: "withNFTAirdropList",
            type: "bool[]",
          },
          {
            internalType: "bool[]",
            name: "withNFTRewardsList",
            type: "bool[]",
          },
        ],
        internalType: "struct NFTCollectionClaimRequest[]",
        name: "_nftCollectionClaimRequests",
        type: "tuple[]",
      },
      { internalType: "bool", name: "_withWalletRewards", type: "bool" },
    ],
    name: "claimInNFTsFromMulti",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum ClaimType", name: "claimType", type: "uint8" },
    ],
    name: "claimScheduleOf",
    outputs: [{ internalType: "uint256", name: "startCycle", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimStartDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimTokenDeposited",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentNFTUnlockTimestamp",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentNFTUnlockedBP",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dc",
    outputs: [
      {
        internalType: "contract IDelegationRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dcV2",
    outputs: [
      { internalType: "contract IDelegateRegistry", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
      { internalType: "uint256", name: "_claimStartDate", type: "uint256" },
    ],
    name: "depositClaimTokenAndStartClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "enum ClaimType", name: "_claimType", type: "uint8" },
    ],
    name: "getClaimInfo",
    outputs: [
      { internalType: "uint128", name: "claimableAmount", type: "uint128" },
      { internalType: "uint256", name: "claimableExpiry", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_collectionId", type: "uint256" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "getClaimInfoByNFT",
    outputs: [
      { internalType: "uint128", name: "claimableAmount", type: "uint128" },
      { internalType: "uint256", name: "claimableExpiry", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum ClaimType", name: "_claimType", type: "uint8" },
    ],
    name: "getClaimSchedule",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "startCycle", type: "uint256" },
          { internalType: "uint256[]", name: "lockUpBPs", type: "uint256[]" },
        ],
        internalType: "struct ClaimSchedule",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_collectionId", type: "uint256" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "getRewardsClaimInfoByNFT",
    outputs: [
      { internalType: "uint128", name: "claimableAmount", type: "uint128" },
      { internalType: "uint256", name: "claimableExpiry", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_collectionId", type: "uint256" },
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
    ],
    name: "getTotalClaimableAmountsByNFTs",
    outputs: [
      { internalType: "uint128", name: "totalClaimable", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "collectionId", type: "uint256" },
          { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
        ],
        internalType: "struct NFTCollectionInfo[]",
        name: "_nftCollectionsInfo",
        type: "tuple[]",
      },
    ],
    name: "getUserClaimDataByCollections",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "collectionId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          {
            internalType: "uint128",
            name: "airdropClaimable",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "airdropClaimableExpiry",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "airdropTotalClaimable",
            type: "uint128",
          },
          { internalType: "uint128", name: "airdropClaimed", type: "uint128" },
          {
            internalType: "uint128",
            name: "rewardsClaimable",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "rewardsClaimableExpiry",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "rewardsTotalClaimable",
            type: "uint128",
          },
          { internalType: "uint128", name: "rewardsClaimed", type: "uint128" },
        ],
        internalType: "struct CollectionClaimData[]",
        name: "collectionClaimInfo",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_claimTokenAddress", type: "address" },
      { internalType: "address", name: "_mvpAddress", type: "address" },
      { internalType: "address", name: "_captainzAddress", type: "address" },
      { internalType: "address", name: "_potatozAddress", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "multiClaim",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nftCollections",
    outputs: [{ internalType: "contract IERC721", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "collectionId", type: "uint256" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "nftUsersClaimData",
    outputs: [
      {
        internalType: "uint128",
        name: "airdropTotalClaimable",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "rewardsTotalClaimable",
        type: "uint128",
      },
      { internalType: "uint128", name: "airdropClaimed", type: "uint128" },
      { internalType: "uint128", name: "rewardsClaimed", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "previousNFTUnlockedBP",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceUpgrader",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_claimActive", type: "bool" }],
    name: "setClaimActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ClaimType[]",
        name: "_claimTypes",
        type: "uint8[]",
      },
      {
        components: [
          { internalType: "uint256", name: "startCycle", type: "uint256" },
          { internalType: "uint256[]", name: "lockUpBPs", type: "uint256[]" },
        ],
        internalType: "struct ClaimSchedule[]",
        name: "_claimSchedules",
        type: "tuple[]",
      },
    ],
    name: "setClaimSchedules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_claimStartDate", type: "uint256" },
    ],
    name: "setClaimStartDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_addresses", type: "address[]" },
      { internalType: "uint128[]", name: "_claimables", type: "uint128[]" },
      {
        internalType: "enum ClaimType[]",
        name: "_claimTypes",
        type: "uint8[]",
      },
    ],
    name: "setClaimables",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_multiClaim", type: "address" }],
    name: "setMultiClaimAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "collectionId", type: "uint256" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          {
            internalType: "uint128",
            name: "airdropTotalClaimable",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "rewardsTotalClaimable",
            type: "uint128",
          },
        ],
        internalType: "struct NFTClaimable[]",
        name: "_nftClaimables",
        type: "tuple[]",
      },
    ],
    name: "setNFTClaimables",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      {
        internalType: "uint128",
        name: "_additionalAirdropTotalClaimable",
        type: "uint128",
      },
    ],
    name: "setRevealedCaptainzClaimable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_collectionId", type: "uint256" },
      {
        internalType: "uint128[]",
        name: "_unclaimTokenIds",
        type: "uint128[]",
      },
    ],
    name: "setUnclaimedNFTRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_upgrader", type: "address" }],
    name: "setUpgrader",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unclaimedNFTRewardsWithdrawn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "collectionId", type: "uint256" },
    ],
    name: "unclaimedNftRewards",
    outputs: [
      { internalType: "uint128", name: "lastTokenId", type: "uint128" },
      { internalType: "uint128", name: "totalUnclaimed", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "upgrader",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "upgraderRenounced",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "enum ClaimType", name: "claimType", type: "uint8" },
    ],
    name: "usersClaimData",
    outputs: [
      { internalType: "uint128", name: "totalClaimable", type: "uint128" },
      { internalType: "uint128", name: "claimed", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_receiver", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdrawClaimToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_receiver", type: "address" }],
    name: "withdrawUnclaimedNFTRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// provider - Alchemy
const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const contractInstance = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  signer
);

main();
