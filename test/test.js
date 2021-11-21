const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleFunding", function () {
  let simpleFunding, owner, alice, addrs;

  before(async () => {
    [owner, alice, ...addrs] = await ethers.getSigners();
    this.SimpleFunding = await ethers.getContractFactory("SimpleFunding");
  });

  beforeEach(async () => {
    simpleFunding = await this.SimpleFunding.deploy();
    await simpleFunding.deployed();
  });

  it("Should set the right owner", async () => {
    expect(await simpleFunding.owner()).to.equal(owner.address);
  });

  it("fund should revert if called without ETH", async () => {
    await expect(simpleFunding.fund()).to.be.revertedWith("Need more ETH");
  });

  it("fund changes contract and funder balances", async () => {
    const amount = ethers.utils.parseEther("0.0005");
    expect(
      await simpleFunding.fund({ value: String(amount) })
    ).to.changeEtherBalances(
      [simpleFunding, owner],
      [amount, -amount]
    );
  });

  it("fund adds user to funders list", async () => {
    await simpleFunding.fund({ value: ethers.utils.parseEther("0.0005") });
    expect(await simpleFunding.funders(0)).to.equal(owner.address);
  });

  it("Keeps track of donator balance", async () => {
    const amount = ethers.utils.parseEther("0.0005");
    await simpleFunding.fund({ value: amount });
    expect(await simpleFunding.funderAddressToAmount(owner.address)).to.equal(amount);
  });

  it("Does not allow non-owners to withdraw funds", async () => {
    await expect(
      simpleFunding.connect(alice).withdrawTo(owner.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Allows an owner to withdraw funds", async () => {
    const amount = ethers.utils.parseEther("0.0005");
    await simpleFunding.fund({ value: amount });
    expect(
      await simpleFunding.withdrawTo(owner.address)
    ).to.changeEtherBalances(
      [simpleFunding, owner],
      [-amount, amount]
    );
  });
});
