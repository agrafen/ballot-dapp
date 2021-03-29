import { Web3ReactProvider, useWeb3React } from '@web3-react/core';

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production';
}

export function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}

export function IsConnectedWallet() {
  const { chainId, error } = useWeb3React();

  return !error && !!chainId;
}
