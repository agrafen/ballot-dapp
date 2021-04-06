/* eslint-disable no-unused-vars */
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';

import { isDevEnv, IsConnectedWallet } from './utils';
import ConnectChain from './ConnectChain';
import TestForm from './containers/testForm';

function ChainId() {
  const { chainId, library } = useWeb3React();

  return (
    <div className="ChainIdWrapper">
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span className="ChainIdText">{chainId ?? 'Not Connected'}</span>
    </div>
  );
}

export default function HomePage({ triedEager, callMethod, setProposals }) {
  return (
    <>
      {isDevEnv() && false && <ChainId />}
      <ConnectChain triedEager={triedEager} />
      <hr />
      {IsConnectedWallet() && (
        <Link to="/new" className="ui green small button">
          Create new ballot
        </Link>
      )}
      {isDevEnv() && (
        <TestForm callMethod={callMethod} setProposals={setProposals} />
      )}
      <br />
      <br />
      <br />
      <small>ver.0.1 //// 2020 (c) agrafen</small>
    </>
  );
}
