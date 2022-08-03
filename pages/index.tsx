import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import snapCfg from '../snap.config';
import snapManifest from '../snap.manifest.json';
import { TLNetwork } from '@trustlines/trustlines-clientlib'

const Home: NextPage = () => {
  const [snapId, setSnapId] = useState('');
  // const snapId = `local:${window.location.href}`;

  useEffect(
    () => {
      if (window.location.hostname === 'localhost') {
        setSnapId(
          `local:${window.location.protocol}//${window.location.hostname}:${snapCfg.cliOptions.port}`,
        );
      } else {
        setSnapId(`npm:${snapManifest.source.location.npm.packageName}`);
      }
    }
  )

  // here we get permissions to interact with and install the snap
  async function connect () {
    const response = await ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [snapId]: {} },
      }],
    })

    console.log(JSON.stringify(response));
    if (response && (response as any).accounts && (response as any).accounts.length > 0) {
      // setCurrentUser((response as any).accounts[0].toLowerCase());
    }
  }

  // here we call the snap's "hello" method
  const send = async () => {
    console.log('snapid', snapId);
    try {
      const response = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: [snapId, {
          method: 'hello'
        }]
      })
    } catch (err) {
      console.error(err)
      // alert('Problem happened: ' + err.message || err)
    }
  }

    const tlbc = new TLNetwork({
      relayUrl: 'https://trustlines-relay.giveth.io/api/v1',
      messagingUrl: 'https://messaging.trustlines.app/api/v1'
    })

  // const allDeployedCurrencyNetworks = await tlNetwork.currencyNetwork.getAll()

  useEffect(() => {
    const getNetworks = async () => {
      // const allDeployedCurrencyNetworks = await tlbc.currencyNetwork.getAll()
      // console.log(allDeployedCurrencyNetworks)

      // await fetch("https://trustlines-relay.giveth.io/api/v1/networks").catch(err => {console.log(err)})
    }

    getNetworks()
  }, [])



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

      <button className='connect' onClick={connect}>Connect</button>
      <button className='sendHello' onClick={send}>Send Hello</button>
    </>
  );
};

export default Home;
