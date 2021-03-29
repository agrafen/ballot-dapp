import { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import { Contract } from '@ethersproject/contracts';
import { injected } from './connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

export function useBlockNumber() {
  const { library } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState(-1);

  useEffect(() => {
    if (!library) {
      return;
    }

    const t = setInterval(async () => {
      try {
        setBlockNumber(await library.getBlockNumber());
      } catch (ex) {
        console.error('failed to get block number', ex);
      }

      return () => {
        clearInterval(t);
      };
    }, 1000);
  }, [library]);

  return blockNumber;
}

export function useCreateContract(Contract) {
  const { library, account } = useWeb3React();

  if (!account) {
    return [null, null];
  }

  const signer = library.getSigner(account);
  return [ethers.ContractFactory.fromSolidity(Contract, signer), signer]
}

export function useContract(contractJson, address) {
  const { chainId, library, account } = useWeb3React();
  const signer = useMemo(() => chainId ? library.getSigner(account).connectUnchecked() : null, [chainId]);

  const contract = useMemo(() => {
    if (!signer) {
      return null;
    }

    return new Contract(
      address,
      contractJson.abi,
      signer
    );
  }, [address, contractJson.abi, signer]);

  return contract;
}

export function useContractCallData(contract, methodName, args) {
  const blockNumber = useBlockNumber();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!contract || !methodName) {
      return null;
    }

    async function loadData() {
      try {
        const result = await contract[methodName](...args);
        setResult(result);
      } catch (ex) {
        console.log(`failed call contract method ${methodName}: `, ex);
      }
    }

    loadData();
  }, [blockNumber]);

  return result;
}
