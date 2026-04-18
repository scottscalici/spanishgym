import React, { useState } from 'react';

const VocabAnalyzer = () => {
  // State for our inputs
  const [text, setText] = useState('');
  const [source, setSource] = useState('spanish-ii');
  
  // State for UI feedback
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus('loading');

    try {
      // This URL will point to the local Node.js server we build next
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send both the raw text and the category tag to the backend
        body: JSON.stringify({ text, source }),
      });

      if (response.ok) {
        setStatus('success');
        setText(''); // Clear the text area for the next passage
        
        // Reset the success message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Failed to reach backend:", error);
      setStatus('error');
    }
  };

  return (
    <div className="vocab-analyzer" style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Vocabulary Analyzer</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Source Categorization */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="source" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Material Source:
          </label>
          <select 
            id="source" 
            value={source} 
            onChange={(e) => setSource(e.target.value)}
            style={{ padding: '8px', fontSize: '16px' }}
          >
            <option value="spanish-ii">Spanish II Reading</option>
            <option value="spanish-4">Spanish 4 Reading</option>
            <option value="ib-assessment">IB Assessment</option>
            <option value="lyrics">Music Lyrics</option>
            <option value="other">Other Material</option>
          </select>
        </div>

        {/* Text Input */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="text-input" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Paste Passage Here:
          </label>
          <textarea
            id="text-input"
            rows="12"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pegue el texto aquí..."
            required
            style={{ padding: '10px', fontSize: '16px', resize: 'vertical' }}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={status === 'loading' || !text.trim()}
          style={{
            padding: '12px',
            fontSize: '16px',
            backgroundColor: status === 'loading' ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: status === 'loading' || !text.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {status === 'loading' ? 'Processing...' : 'Analyze Frequency'}
        </button>

        {/* UI Feedback */}
        {status === 'success' && (
          <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
            Success! The vocabulary has been tallied and saved.
          </div>
        )}
        {status === 'error' && (
          <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
            Error: Make sure your Node backend is running on port 3001.
          </div>
        )}
      </form>
    </div>
  );
};

export default VocabAnalyzer;
