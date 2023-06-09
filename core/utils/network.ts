import { FunctionComponent } from 'react';
import algorandTokenSvg from '../assets/networks/algorand-token.svg';
import algorandTokenPng from '../assets/networks/algorand-token.png';
import voiTokenSvg from '../assets/networks/voi-token.svg';
import voiTokenPng from '../assets/networks/voi-token.png';

export type NetworkToken = {
  name: string;
  ticker: string;
  decimals: number;
  svg: FunctionComponent;
  png: string;
};

export type Node = {
  token?: string;
  server: string;
  port?: number;
  description?: string;
};

export type Network = {
  name: string;
  description: string;
  genesisId: string;
  isMainnet: boolean;
  token: NetworkToken;
  nodes: Node[];
  indexers: Node[];
  faucet?: string;
};

export const NETWORKS: Record<string, Network> = {
  AlgorandMainnet: {
    name: 'Algorand',
    description: 'Algorand Mainnet Network',
    genesisId: 'mainnet-v1.0',
    isMainnet: true,
    token: {
      name: 'Algorand',
      ticker: 'ALGO',
      decimals: 6,
      svg: algorandTokenSvg,
      png: algorandTokenPng,
    },
    nodes: [
      {
        server: 'https://mainnet-api.algonode.cloud',
        port: 443,
        description: 'Free global API provided by AlgoNode.io',
      },
    ],
    indexers: [
      {
        server: 'https://mainnet-idx.algonode.cloud',
        port: 443,
        description: 'Free global API provided by AlgoNode.io',
      },
    ],
  },
  AlgorandTestnet: {
    name: 'Algorand',
    description: 'Algorand Testnet Network',
    genesisId: 'testnet-v1.0',
    isMainnet: false,
    token: {
      name: 'Algorand',
      ticker: 'ALGO',
      decimals: 6,
      svg: algorandTokenSvg,
      png: algorandTokenPng,
    },
    nodes: [
      {
        server: 'https://testnet-api.algonode.cloud',
        port: 443,
        description: 'Free global API provided by AlgoNode.io',
      },
    ],
    indexers: [
      {
        server: 'https://testnet-idx.algonode.cloud',
        port: 443,
        description: 'Free global API provided by AlgoNode.io',
      },
    ],
    faucet: 'https://bank.testnet.algorand.network/',
  },
  VoiTestnet: {
    name: 'Voi',
    description: 'Voi Testnet Network',
    genesisId: 'voi-test-v1',
    isMainnet: false,
    token: {
      name: 'Voi',
      ticker: 'VOI',
      decimals: 6,
      svg: voiTokenSvg,
      png: voiTokenPng,
    },
    nodes: [
      {
        server: 'https://voitest-api.algorpc.pro',
        port: 443,
        description: 'Free global API provided by AlgoNode.io',
      },
    ],
    indexers: [
      {
        server: 'https://voitest-idx.algorpc.pro',
        port: 443,
        description: 'Free Indexer API provided by AlgoNode.io',
      },
    ],
  },
};
