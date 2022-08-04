import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import snapCfg from '../snap.config';
import snapManifest from '../snap.manifest.json';
import { getTrustlinesForUser, sendSnapMethod } from '../helpers/utils';


const Home: NextPage = () => {
  const [snapId, setSnapId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [trustlines, setTrustlines] = useState([]);

  useEffect(() => {
    currentUser && getTrustlinesForUser(currentUser).then(setTrustlines);
  }, [currentUser]);
  useEffect(
    () => {
      if (window.location.hostname === 'localhost') {
        setSnapId(
          `local:${window.location.protocol}//${window.location.hostname}:${snapCfg.cliOptions.port}`,
        );
      } else {
        setSnapId(`npm:${snapManifest.source.location.npm.packageName}`);
      }
    },
  );

  // here we get permissions to interact with and install the snap
  const connect = async () => {
    const response = await ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [snapId]: {} },
        eth_accounts: {},
      }],
    });

    console.log(JSON.stringify(response));
    if (response && (response as any).accounts && (response as any).accounts.length > 0) {
      setCurrentUser((response as any).accounts[0].toLowerCase());
    }
  };

  const sendTrustlinesTransfer = async (
    recipientAddress, currencyNetwork, amount,
  ): Promise<string> => {

    console.log("wtf",recipientAddress, currencyNetwork, amount)
    await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [snapId, {
        method: 'tl_transfer', params: {
          payment: {
            currencyNetwork, amount, recipientAddress,
          },
        },
      }],
    });
  };


  return (
    <>
      <h1>Hello, Snaps!</h1>
      <details>
        <summary>Instructions</summary>
        <ul>
          <li>First, click "Connect". Then, try out the other buttons!</li>
          <li>Please note that:</li>
          <ul>
            <li>
              The <code>snap.manifest.json</code> and <code>package.json</code> must be located in the server root
              directory..
            </li>
            <li>
              The Snap bundle must be hosted at the location specified by the <code>location</code> field
              of <code>snap.manifest.json</code>.
            </li>
          </ul>
        </ul>
      </details>
      <br />
      {currentUser ? (
          <>
            <div>Your trustlines</div>
            {trustlines.map(tl => {
              return <div key={`${tl.counterParty}-${tl.currencyNetwork}`}>{tl.currencyNetwork} | {tl.counterParty} | given: {tl.leftGiven} |
                received: {tl.leftReceived}
                <button onClick={() => sendTrustlinesTransfer(tl.counterParty, tl.currencyNetwork, 5)}>send 5</button>
                ;
              </div>;
            })}
          </>

        ) :
        (
          <>

            <button className='connect' onClick={connect}>Connect</button>
          </>

        )
      }


    </>
  );
};

export default Home;
