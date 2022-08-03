import { OnRpcRequestHandler } from '@metamask/snap-types';

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {

  console.log('on rpc request', origin, request);
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello!`,
            description:
              'blabla.',
            textAreaContent:
              'blabla',
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
