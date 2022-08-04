import { OnRpcRequestHandler } from '@metamask/snap-types';
import {sendTransfer} from '../../helpers/utils';

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {

  switch (request.method) {
    case 'tl_transfer':

      return await sendTransfer(wallet, request.params.payment);

    default:
      throw new Error('Method not found.');
  }
};
