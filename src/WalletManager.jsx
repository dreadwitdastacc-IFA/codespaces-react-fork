import React, { useState, useEffect } from 'react';

const RITUAL_MARKERS = [
  '⚡', // Energy/Thunder - Ṣàngó
  '🌊', // Flow/Water - Ọ̀ṣun/Yemoja
  '🔥', // Fire/Passion - Ṣàngó
  '🌿', // Growth/Nature - Ọ̀ṣun
  '💎', // Wealth/Crystal - Àjẹ́
  '🦅', // Vision/Eagle - Àjẹ́
  '🐺', // Protection/Wolf - Ògún
  '🦋', // Transformation/Butterfly - Ìyámi Òṣòròngà
  '🌙', // Intuition/Moon - Òṣun
  '☀️', // Clarity/Sun - Òrúnmìlà
  '🌟', // Divine/Star - Òrìṣà
  '🕊️', // Peace/Dove - Òbàtálá
];

const ORISA_DEITIES = [
  'Ṣàngó', 'Ọ̀ṣun', 'Yemoja', 'Ògún', 'Ọya', 'Èṣù', 'Òbàtálá',
  'Ìyámi Òṣòròngà', 'Àjẹ́', 'Òrúnmìlà', 'Ìrúnmọlẹ̀', 'Òrìṣà'
];

function WalletManager({ wallets, onUpdateWallet }) {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletData, setWalletData] = useState({});
  const [formData, setFormData] = useState({
    label: '',
    note: '',
    tag: '',
    orisa: '',
    verified: false,
    ritualMarker: '',
    tags: []
  });

  useEffect(() => {
    // Load wallet data from localStorage or initialize
    const saved = localStorage.getItem('walletMetadata');
    if (saved) {
      setWalletData(JSON.parse(saved));
    }
  }, []);

  const saveWalletData = (data) => {
    localStorage.setItem('walletMetadata', JSON.stringify(data));
    setWalletData(data);
  };

  const handleWalletSelect = (walletKey) => {
    setSelectedWallet(walletKey);
    const existing = walletData[walletKey] || {};
    setFormData({
      label: existing.label || '',
      note: existing.note || '',
      tag: existing.tag || '',
      orisa: existing.orisa || '',
      verified: existing.verified || false,
      ritualMarker: existing.ritualMarker || '',
      tags: existing.tags || []
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSave = () => {
    if (!selectedWallet) return;

    const updatedData = {
      ...walletData,
      [selectedWallet]: {
        ...formData,
        address: selectedWallet,
        lastUpdated: new Date().toISOString()
      }
    };

    saveWalletData(updatedData);
    onUpdateWallet && onUpdateWallet(selectedWallet, updatedData[selectedWallet]);
  };

  const exportWalletData = () => {
    const dataStr = JSON.stringify(walletData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'orisa-wallets.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importWalletData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          const updatedData = { ...walletData, ...importedData };
          saveWalletData(updatedData);
        } catch (error) {
          alert('Error importing wallet data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Òrìṣà Wallet Manager - Sacred Connections & Ritual Markers</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Wallet List */}
        <div style={{ flex: 1 }}>
          <h3>Wallets</h3>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={importSampleData}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Import Sample Òrìṣà Wallet
            </button>
            <button
              onClick={exportWalletData}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Export Wallets
            </button>
            <label style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-block'
            }}>
              Import from File
              <input
                type="file"
                accept=".json"
                onChange={importWalletData}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
            {Object.keys(wallets || {}).map(walletKey => (
              <div
                key={walletKey}
                onClick={() => handleWalletSelect(walletKey)}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: selectedWallet === walletKey ? '#e3f2fd' : 'white',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                {getWalletDisplay(walletKey)}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Details */}
        <div style={{ flex: 2 }}>
          {selectedWallet ? (
            <div>
              <h3>Manage: {selectedWallet}</h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Label (Display Name)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  placeholder="e.g., Àṣè nàṣà wà"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Òrìṣà (Deity)
                </label>
                <select
                  value={formData.orisa}
                  onChange={(e) => handleInputChange('orisa', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Òrìṣà...</option>
                  {ORISA_DEITIES.map(orisa => (
                    <option key={orisa} value={orisa}>{orisa}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Tag
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  placeholder="e.g., Èṣù bí"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Note
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="e.g., Àboru aboye"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Additional Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g., hodl, trading, savings"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Ritual Marker
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {RITUAL_MARKERS.map(marker => (
                    <button
                      key={marker}
                      onClick={() => handleInputChange('ritualMarker', marker)}
                      style={{
                        padding: '0.5rem',
                        fontSize: '1.2rem',
                        border: formData.ritualMarker === marker ? '2px solid #007bff' : '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: formData.ritualMarker === marker ? '#e3f2fd' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {marker}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => handleInputChange('verified', e.target.checked)}
                  />
                  <span>Verified Òrìṣà Connection</span>
                </label>
              </div>

              <button
                onClick={handleSave}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              Select a wallet to manage Òrìṣà connections, tags, notes, and ritual markers
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Òrìṣà Ritual Markers & Associations</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          <div>⚡ Ṣàngó - Energy, Thunder, Justice</div>
          <div>🌊 Ọ̀ṣun/Yemoja - Flow, Water, Fertility</div>
          <div>🔥 Ṣàngó - Fire, Passion, Transformation</div>
          <div>🌿 Ọ̀ṣun - Growth, Nature, Healing</div>
          <div>💎 Àjẹ́ - Wealth, Crystal, Prosperity</div>
          <div>🦅 Àjẹ́ - Vision, Eagle, Wisdom</div>
          <div>🐺 Ògún - Protection, Wolf, Strength</div>
          <div>🦋 Ìyámi Òṣòròngà - Transformation, Butterfly, Mystery</div>
          <div>🌙 Òṣun - Intuition, Moon, Emotions</div>
          <div>☀️ Òrúnmìlà - Clarity, Sun, Knowledge</div>
          <div>🌟 Òrìṣà - Divine, Star, Spirituality</div>
          <div>🕊️ Òbàtálá - Peace, Dove, Purity</div>
        </div>
      </div>
    </div>
  );
}

export default WalletManager;
