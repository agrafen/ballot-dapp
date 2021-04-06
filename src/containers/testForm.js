// import React from 'react';

export default function TestForm({ callMethod, setProposals }) {
  const handleGetList = async () => {
    const proposals = await callMethod('getList');
    setProposals(proposals);
  };

  return (
    <>
      <hr />
      <button onClick={() => callMethod('getVoters')}>get voters</button>
      <button onClick={handleGetList}>get list</button>
      <button onClick={() => callMethod('getProposal', 0)}>
        get first poropsal
      </button>
      <button onClick={() => callMethod('getQuestion')}>get question</button>
      <button onClick={() => callMethod('getVotingStatus')}>
        get voting status
      </button>
      <button onClick={() => callMethod('setTestData')}>set test data</button>
    </>
  );
}
