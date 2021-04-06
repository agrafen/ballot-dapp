const Ballot = artifacts.require('Ballot');

module.exports = async function(deployer) {
  await deployer.deploy(Ballot, [
    web3.utils.fromAscii('test1'),
    web3.utils.fromAscii('test2'),
  ]);
}
