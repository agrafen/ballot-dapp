// SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.7.0 <0.8.0;
pragma solidity >=0.5.0 <0.7.0;
// pragma abicoder v2;
pragma experimental ABIEncoderV2;

// import './Base.sol';

library Lib {
    struct Voting {
        uint8 proposalId;
        bool exist;
    }
}

// contract Election is Base {
contract Ballot {
    address payable private owner;
    bytes32[] _proposals;
    bytes32 _test;
    bytes32 _question;
    
    struct Proposal {
        uint id;
        bytes32 name;
        uint count;
        // string name;
    }
    
    Proposal[] public _proposalsStruct;
    
    mapping(address => Lib.Voting) voting;
    
    // ["fist", "second"]
    constructor(bytes32 question, bytes32[] memory proposalNames) public {
    // constructor(string memory test) {
        _proposals = proposalNames;
        _question = question;
        // _test = bytes32(test);

        owner = msg.sender;
        
        for (uint i = 0; i < proposalNames.length; i++) {
            _proposalsStruct.push(Proposal({
                id: i,
                // name: stringToBytes32(proposalNames[i]),
                name: proposalNames[i],
                count: 0
            }));
        }
    }
    
    function vote(uint8 id) public {
        require(!voting[msg.sender].exist, 'Voting error');
        
        _proposalsStruct[id].count++;
        voting[msg.sender].proposalId = id;
        voting[msg.sender].exist = true;
    }

    function getVotingStatus() public view returns(bool) {
      return voting[msg.sender].exist;
    }
    
    function getTest() public view returns(bytes32) {
        return _test;
    }
    
    function getList() public view returns(Proposal[] memory) {
        return _proposalsStruct;
    }
    
    function getQuestion() public view returns(bytes32) {
        return _question;
    }

    function getProposal(uint id) public view returns(Proposal memory) {
        require(id <= _proposalsStruct.length, 'Error1');
        return _proposalsStruct[id];
    }

    function setTestData() public {
      for (uint8 i = 0; i < _proposalsStruct.length; i++) {
        _proposalsStruct[i].count = i % 2 == 0 ? 4 : 2;
      }
    }

    // function getProposalName(uint id) public view returns(string memory) {
    //     require(id <= _proposalsStruct.length, 'Error1');
    //     return bytes32ToString(_proposalsStruct[id].name);
    // }
    
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }
    
    /* Functions for tests on Remix
    *********************************************************************/
    
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
