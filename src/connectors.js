import { InjectedConnector } from '@web3-react/injected-connector';
// const supportedChainIds = process.env.NODE_ENV === 'development' ? [1337] : [1023];
export const injected = new InjectedConnector({ supportedChainIds: [1337, 1023] });
