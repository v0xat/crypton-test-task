const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleFunding", function () {
  let simpleFunding, owner, alice, bob, addrs;
  const minAmount = ethers.utils.parseEther("0.001");

  before(async () => {
    [owner, alice, bob, ...addrs] = await ethers.getSigners();
    this.SimpleFunding = await ethers.getContractFactory("SimpleFunding");
  });

  beforeEach(async () => {
    simpleFunding = await this.SimpleFunding.deploy();
    await simpleFunding.deployed();
  });

  it("Should set the right owner", async () => {
    expect(await simpleFunding.owner()).to.equal(owner.address);
  });

  it("Should not be able to fund with insufficient ether", async () => {
    const amount = ethers.utils.parseEther("0.0001");
    await expect(simpleFunding.fund({
      value: amount
    })).to.be.revertedWith("Need more ETH");
  });

  it("fund should emit event", async () => {
    await expect(simpleFunding.fund({ value: minAmount }))
      .to.emit(simpleFunding, "ReceivedFunds")
      .withArgs(owner.address, minAmount);
  });

  it("fund changes contract and funder balances", async () => {
    expect(
      await simpleFunding.fund({ value: minAmount })
    ).to.changeEtherBalances(
      [simpleFunding, owner],
      [minAmount, -minAmount]
    );
  });

  it("fund adds user to funders list", async () => {
    await simpleFunding.fund({ value: minAmount });
    expect(await simpleFunding.funders(0)).to.equal(owner.address);
  });

  it("Keeps track of donator balance", async () => {
    await simpleFunding.fund({ value: minAmount });
    expect(await simpleFunding.funderAddressToAmount(owner.address)).to.equal(minAmount);
  });

  it("Does not allow non-owners to withdraw funds", async () => {
    await expect(
      simpleFunding.connect(alice).withdrawTo(owner.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Allows an owner to withdraw funds", async () => {
    await simpleFunding.fund({ value: minAmount });
    expect(
      await simpleFunding.withdrawTo(owner.address)
    ).to.changeEtherBalances(
      [simpleFunding, owner],
      [-minAmount, minAmount]
    );
  });

  it("getFunders returns correct list of funders", async () => {
    await simpleFunding.fund({ value: minAmount });
    await simpleFunding.connect(alice).fund({ value: minAmount });
    await simpleFunding.connect(bob).fund({ value: minAmount });
    
    const funders = await simpleFunding.getFunders();
    expect(funders).to.have.same.members([
      owner.address,
      alice.address,
      bob.address
    ]);
  });
});
