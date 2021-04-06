import { useState } from 'react';
import web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Grid,
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import Ballot from './containers/ballot';
import NewBallotForm from './containers/newBallotForm';
import HomePage from './home';

import { useEagerConnect, useContract } from './hooks';

import BallotContract from './contract_build/Ballot2.json';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 5000;
  return library;
}

function App(props) {
  const triedEager = useEagerConnect();
  const contract = useContract(
    BallotContract,
    '0x33428EDD7e7802a1d5A19c113660D8f44FDD99D2'
  );
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);

  const callMethod = async (name, ...args) => {
    console.log('callMethod', name);
    if (loading) {
      return;
    }

    setLoading(true);
    let result = null;

    try {
      console.log('await contract');
      result = await contract[name](...args);
      console.log('result', result);
      if (name === 'getList') {
        result.map((p) =>
          console.log(
            'result',
            web3.utils.hexToNumberString(p.id._hex),
            web3.utils.hexToNumberString(p.count._hex),
            web3.utils.toUtf8(p.name)
          )
        );
      } else {
        console.log(
          'result decoded',
          web3.utils.toUtf8(result?.name || result)
        );
      }
    } catch (ex) {
      console.error('transaction error: ', ex);
    } finally {
      setLoading(false);
    }

    return result;
  };

  const homeProps = { triedEager, callMethod, setProposals };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <header className="App-header">
          <Link to="/">
            <h1>Ballot dapp</h1>
          </Link>
        </header>
        <main>
          <Switch>
            <Route path="/new">
              <NewBallotForm />
            </Route>
            <Route path="/:address">
              <Ballot />
            </Route>
            <Route path="/">
              <HomePage {...homeProps} />
            </Route>
          </Switch>
        </main>
      </Grid.Column>
    </Grid>
  );
}

export default function () {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HashRouter>
        <Route>
          <App />
        </Route>
      </HashRouter>
    </Web3ReactProvider>
  );
}
