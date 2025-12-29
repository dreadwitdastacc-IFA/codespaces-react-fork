import React, { useState } from 'react';
import { generateMultisigScript, isValidCompressedPubkey, generateP2SHAddress, generateP2WSHAddress } from './utils/cryptoUtils';
import QRCode from 'qrcode';

function MultisigGenerator() {
  const [pubkeys, setPubkeys] = useState(['', '']);
  const [threshold, setThreshold] = useState(2);
  const [script, setScript] = useState('');
  const [p2shAddress, setP2shAddress] = useState('');
  const [p2wshAddress, setP2wshAddress] = useState('');
  const [p2shQR, setP2shQR] = useState('');
  const [p2wshQR, setP2wshQR] = useState('');
  const [error, setError] = useState('');
  const [isTestnet, setIsTestnet] = useState(false);
  const [coin, setCoin] = useState('litecoin');

  const addPubkey = () => {
    setPubkeys([...pubkeys, '']);
  };

  const updatePubkey = (index, value) => {
    const newPubkeys = [...pubkeys];
    newPubkeys[index] = value;
    setPubkeys(newPubkeys);
  };

  const removePubkey = (index) => {
    if (pubkeys.length > threshold) {
      setPubkeys(pubkeys.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    setError('');
    const validPubkeys = pubkeys.filter(pk => isValidCompressedPubkey(pk));
    if (validPubkeys.length < threshold) {
      setError(`Need at least ${threshold} valid public keys, but only ${validPubkeys.length} are valid.`);
      return;
    }
    if (threshold < 1 || threshold > validPubkeys.length) {
      setError('Invalid threshold.');
      return;
    }
    try {
      const generatedScript = generateMultisigScript(validPubkeys, threshold);
      setScript(generatedScript);
      const p2sh = generateP2SHAddress(generatedScript, coin, isTestnet);
      setP2shAddress(p2sh);
      const p2wsh = generateP2WSHAddress(generatedScript, coin, isTestnet);
      setP2wshAddress(p2wsh);

      // Generate QR codes
      const p2shQRData = await QRCode.toDataURL(p2sh, { width: 200 });
      setP2shQR(p2shQRData);
      const p2wshQRData = await QRCode.toDataURL(p2wsh, { width: 200 });
      setP2wshQR(p2wshQRData);
    } catch (err) {
      setError('Error generating addresses: ' + err.message);
    }
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>M-of-N Multisig Address Generator</h2>
      <p>Generate P2SH and P2WSH addresses for multisig wallets on Bitcoin-family chains.</p>
      <p><strong>M-of-N multisig: At least M out of N pubkeys must sign.</strong></p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Cryptocurrency:</label>
        <select value={coin} onChange={(e) => setCoin(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="bitcoin">Bitcoin</option>
          <option value="litecoin">Litecoin</option>
          <option value="dogecoin">Dogecoin</option>
        </select>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={isTestnet}
            onChange={(e) => setIsTestnet(e.target.checked)}
          />
          Testnet
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Threshold (M - signatures required):</label>
        <input
          type="number"
          min="1"
          max={pubkeys.length}
          value={threshold}
          onChange={(e) => setThreshold(Math.min(parseInt(e.target.value) || 1, pubkeys.length))}
          style={{ marginLeft: '0.5rem', width: '60px' }}
        />
        <span style={{ marginLeft: '0.5rem' }}>out of {pubkeys.length} owners</span>
      </div>
      
      <h3>Public Keys</h3>
      {pubkeys.map((pubkey, index) => (
        <div key={index} style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={pubkey}
            onChange={(e) => updatePubkey(index, e.target.value)}
            placeholder="02/03 followed by 64 hex chars"
            style={{ width: '500px', padding: '0.5rem' }}
          />
          {pubkeys.length > threshold && (
            <button onClick={() => removePubkey(index)} style={{ marginLeft: '0.5rem' }}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addPubkey} style={{ marginBottom: '1rem' }}>Add Public Key</button>
      
      <button onClick={handleGenerate} style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
        Generate Addresses
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {script && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Redeem Script (Hex):</h3>
          <code style={{ wordBreak: 'break-all', background: '#f5f5f5', padding: '0.5rem', display: 'block' }}>
            {script}
          </code>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <h3>P2SH Address (Legacy):</h3>
              <code style={{ wordBreak: 'break-all', background: '#f5f5f5', padding: '0.5rem', display: 'block', marginBottom: '0.5rem' }}>
                {p2shAddress}
              </code>
              {p2shQR && <img src={p2shQR} alt="P2SH Address QR Code" />}
              <p><small>OP_HASH160 &lt;20-byte-hash&gt; OP_EQUAL - Full redeem script revealed at spend time in scriptSig.</small></p>
            </div>
            
            <div>
              <h3>P2WSH Address (SegWit):</h3>
              <code style={{ wordBreak: 'break-all', background: '#f5f5f5', padding: '0.5rem', display: 'block', marginBottom: '0.5rem' }}>
                {p2wshAddress}
              </code>
              {p2wshQR && <img src={p2wshQR} alt="P2WSH Address QR Code" />}
              <p><small>0 &lt;32-byte-sha256(redeem_script)&gt; - Witness contains signatures and redeem script.</small></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultisigGenerator;
