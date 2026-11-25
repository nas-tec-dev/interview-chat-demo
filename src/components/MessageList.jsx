import { useEffect, useRef } from 'react';

export default function MessageList({ messages, isThinking }) {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isThinking]);

  return (
    <div className="message-list" ref={listRef} aria-live="polite">
      {messages.map((message) => (
        <article
          key={message.id}
          className={[
            'message-row',
            message.role === 'user' ? 'user-row' : 'interviewer-row',
          ].join(' ')}
        >
          <span className="message-sender">
            {message.role === 'user' ? 'あなた' : '面接官'}
          </span>
          {message.aside && (
            <p className="stage-direction">{message.aside}</p>
          )}
          <div className="message-bubble">{message.text}</div>
        </article>
      ))}
      {isThinking && (
        <p className="thinking-message" role="status">
          面接官が返信しています…
        </p>
      )}
    </div>
  );
}
