const Ballot2 = artifacts.require('Ballot2');

module.exports = async function(deployer) {
  await deployer.deploy(Ballot2, [
    web3.utils.fromAscii('test1'),
    web3.utils.fromAscii('test2'),
  ]);
}
