pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

library Lib {
    struct Voting {
        uint8 proposalId;
        bool exist;
    }
}

contract Ballot {
    address payable private owner;
    bytes32[] _proposals;
    bytes32 _test;
    bytes32 _question;
    
    struct Proposal {
        uint id;
        bytes32 name;
        uint count;
    }
    
    Proposal[] public _proposalsStruct;
    
    mapping(address => Lib.Voting) voting;
    
    constructor(bytes32 question, bytes32[] memory proposalNames) public {
        _proposals = proposalNames;
        _question = question;

        owner = msg.sender;
        
        for (uint i = 0; i < proposalNames.length; i++) {
            _proposalsStruct.push(Proposal({
                id: i,
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

    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }
}
