import React from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';import {
  Button,
} from 'semantic-ui-react';
import { Spinner } from './Spinner';
import { injected } from './connectors';
import { useEagerConnect, useInactiveListener } from './hooks';

export default function ConnectChain(props) {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const activating = injected === activatingConnector;
  const connected = injected === connector;
  const disabled = !props.triedEager || !!activatingConnector || !!error;

  useInactiveListener(!props.triedEager || !!activatingConnector);

  let isDisconnect = !error && chainId;
  const buttonText = isDisconnect
    ? 'Disconnect'
    : activating
    ? 'Connectting'
    : 'Connect';

  return (
    <Button
      style={{
        borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
        cursor: disabled ? 'unset' : 'pointer',
        position: 'relative',
      }}
      className="ConnectButton"
      disabled={disabled}
      onClick={() => {
        if (!isDisconnect) {
          setActivatingConnector(injected);
          activate(injected);
        } else {
          deactivate();
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          color: 'black',
          margin: '0 0 0 1rem',
        }}
      >
        {activating && (
          <Spinner
            color={'red'}
            style={{ height: '50%', marginLeft: '-1rem' }}
          />
        )}
      </div>
      {buttonText} wallet
    </Button>
  );
}
