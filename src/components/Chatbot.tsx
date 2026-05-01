import React, { useState } from 'react';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your E-Pass assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(input);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {open && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <span>E-Pass Assistant 🤖</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '6px 0' }}>
                <span style={{ ...styles.bubble, backgroundColor: m.role === 'user' ? '#003580' : '#f0f0f0', color: m.role === 'user' ? 'white' : '#333' }}>
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <p style={{ color: '#999', fontSize: '12px' }}>Typing...</p>}
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.chatInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
            />
            <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button style={styles.floatBtn} onClick={() => setOpen(!open)}>💬</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 },
  chatBox: { width: '350px', height: '450px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', marginBottom: '10px' },
  chatHeader: { backgroundColor: '#003580', color: 'white', padding: '12px 16px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' },
  closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' },
  messages: { flex: 1, overflowY: 'auto', padding: '12px' },
  bubble: { display: 'inline-block', padding: '8px 14px', borderRadius: '16px', fontSize: '13px', maxWidth: '80%' },
  inputArea: { display: 'flex', padding: '10px', borderTop: '1px solid #eee', gap: '8px' },
  chatInput: { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' },
  sendBtn: { padding: '8px 14px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  floatBtn: { width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#003580', color: 'white', border: 'none', fontSize: '24px', cursor: 'pointer', display: 'block', marginLeft: 'auto' },
};

export default Chatbot;