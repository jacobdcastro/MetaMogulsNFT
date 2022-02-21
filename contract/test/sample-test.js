const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MetaMogulsV2', function () {
  it("Should return the new greeting once it's changed", async function () {
    const MetaMoguls = await ethers.getContractFactory('MetaMogulsV2');
    const metaMoguls = await MetaMoguls.deploy('Hello, world!');
    await metaMoguls.deployed();

    expect(await metaMoguls.greet()).to.equal('Hello, world!');

    const setGreetingTx = await metaMoguls.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await metaMoguls.greet()).to.equal('Hola, mundo!');
  });
});
