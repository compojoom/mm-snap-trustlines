import { SnapRpcMethodRequest } from '../global';
import {
  getBIP44AddressKeyDeriver,
} from '@metamask/key-tree';
import { TLNetwork } from '@trustlines/trustlines-clientlib';
import { SnapProvider } from "@metamask/snap-types";
import { calculateIdentityAddress } from '@trustlines/trustlines-clientlib/lib/wallets/IdentityWallet';

export async function sendSnapMethod<T>(
  request: SnapRpcMethodRequest,
  snapId: string,
): Promise<T> {
  // @ts-ignore
  return await window.ethereum.request({
    method: snapId,
    params: [request],
  });
}

export const identityFactory = '0x43e7ed7F5bcc0beBE8758118fae8609607CD874f';
export const relayUrl = 'https://trustlines-relay.giveth.io/api/v1';



export const getTrustlinesForUser = async (user: string) => {
  const identityAddress = await calculateIdentityAddress(identityFactory, user);
  const endpoint = `users/${identityAddress}/trustlines`;

  const response = await fetch(relayUrl + '/' + endpoint);
  const trustlines = await response.json();

  return trustlines

  return []
};


/**
 * Return derived KeyPair from seed.
 * @param wallet
 */
export const getKeyPair = async (wallet: SnapProvider): Promise<{ address: string, privateKey: string }> => {
  // By way of example, we will use Dogecoin, which has `coin_type` 3.
  const ethNode = await wallet.request({
    method: 'snap_getBip44Entropy_60',
  });

// Next, we'll create an address key deriver function for the Dogecoin coin_type node.
// In this case, its path will be: m / 44' / 3' / 0' / 0 / address_index
  const deriveEthAddress = await getBIP44AddressKeyDeriver(ethNode);

// These are BIP-44 nodes containing the extended private keys for
// the respective derivation paths.

// // m / 44' / 3' / 0' / 0 / 0
  const addressKey0 = await deriveEthAddress(0);

  return {
    address: addressKey0.address as string,
    privateKey: addressKey0.privateKey as string,
  };
}


export async function sendTransfer(wallet: SnapProvider, payment: {
  currencyNetwork, recipientAddress, amount,
}) {

  try {
    const tlbc = new TLNetwork({
      relayUrl: relayUrl,
      messagingUrl: 'https://messaging.trustlines.app/api/v1',
      walletType: 'identity',
      identityFactoryAddress: identityFactory,
      identityImplementationAddress: '0x22e54f55D010542BEbabCe0Bb36dA64fB966caE1',
      chainId: 4660
    });


    const keyPair = await getKeyPair(wallet);


    const tlbcWallet = await tlbc.user.recoverFromPrivateKey(keyPair.privateKey)
    await tlbc.user.loadFrom(tlbcWallet)
    const {currencyNetwork, recipientAddress, amount} = payment;


    const rawTx = await tlbc.payment.prepare(currencyNetwork, recipientAddress, amount)


    const confirmation = await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: `Send IOU!`,
          description:
            'Send some IOUs to your contact.',
          textAreaContent: `You will send ${amount} TL to ${recipientAddress} in ${currencyNetwork}`
        },
      ],
    });


    if(confirmation) {
      await tlbc.payment.confirmPayment(rawTx)
    }


    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }

}

