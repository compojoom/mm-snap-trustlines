import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export interface TransferRequest {
  method: "tl_transfer";
  params: {
    message: string
  }
}

export type TlRpcRequest =
  | TransferRequest;

type Method = TlRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}

export interface GetSnapsRequest {
  method: "wallet_getSnaps";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [TlRpcRequest];
}
