const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const Web3 = require("web3");

// Start test block
describe("ABC NFT", function () {
  before(async function () {
    this.Coin = await ethers.getContractFactory("ABCNFT2");
  });

  beforeEach(async function () {
    this.coin = await this.Coin.deploy();
    await this.coin.deployed();
  });

  it("should mint assets only once", async function () {
    Promise.all([this.coin.safeMint("same"), this.coin.safeMint("same")]).catch(
      (e) => {
        expect(e.message).to.equal(
          "VM Exception while processing transaction: reverted with reason string 'This NFT has been already minted'"
        );
      }
    );
  });

  it("should fail after 3 mints", async function () {
    const promises = [];
    for (let count = 1; count < 4; count++) {
      promises.push(this.coin.safeMint(`uri:${count}`));
    }
    await Promise.all(promises).catch((e) => {
      expect(e.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Max NFT supply reached'"
      );
    });
  });
});
