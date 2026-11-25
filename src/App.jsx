import { useEffect, useRef, useState } from 'react';
import {
  createInterviewSession,
  sendInterviewMessage,
} from './api/interviewApi.js';
import MessageComposer from './components/MessageComposer.jsx';
import MessageList from './components/MessageList.jsx';

function makeRequestId() {
  return crypto.randomUUID();
}

function toChatMessage(message, id) {
  return {
    id,
    role: 'interviewer',
    aside: message.aside,
    text: message.text,
  };
}

export default function App() {
  const startRequestId = useRef(makeRequestId());
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [retryRequest, setRetryRequest] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [startError, setStartError] = useState('');
  const [chatError, setChatError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    createInterviewSession(startRequestId.current)
      .then((createdSession) => {
        if (!isCurrent) {
          return;
        }

        setSession(createdSession);
        setMessages([
          toChatMessage(createdSession.interviewer_message, 'question-0'),
        ]);
      })
      .catch((error) => {
        if (isCurrent) {
          setStartError(error.message);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsStarting(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const submittedAnswer = answer.trim();
    if (
      !submittedAnswer ||
      isThinking ||
      isComplete ||
      !session
    ) {
      return;
    }

    const answerId = `answer-${messages.length}`;
    const requestId = retryRequest?.message === submittedAnswer
      ? retryRequest.requestId
      : makeRequestId();
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: answerId, role: 'user', text: submittedAnswer },
    ]);
    setAnswer('');
    setChatError('');
    setIsThinking(true);
    setRetryRequest({ message: submittedAnswer, requestId });

    try {
      const response = await sendInterviewMessage(
        session.session_id,
        submittedAnswer,
        requestId,
      );
      setMessages((currentMessages) => [
        ...currentMessages,
        toChatMessage(response.interviewer_message, response.message_id),
      ]);
      setIsComplete(response.is_complete);
      setRetryRequest(null);
    } catch (error) {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== answerId),
      );
      setAnswer(submittedAnswer);
      setChatError(error.message);
    } finally {
      setIsThinking(false);
    }
  }

  if (isStarting || startError) {
    return (
      <main className="connection-state" aria-live="polite">
        {isStarting ? (
          <p>Pythonから面談メッセージを読み込んでいます。</p>
        ) : (
          <>
            <p>{startError} Python APIを8002番ポートで起動してください。</p>
            <button type="button" onClick={() => window.location.reload()}>
              接続を再試行
            </button>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="chat-page">
      <section className="chat-panel" aria-label="模擬面接チャット">
        <MessageList messages={messages} isThinking={isThinking} />
        {chatError && <p className="chat-error" role="alert">{chatError}</p>}
        <MessageComposer
          answer={answer}
          isBusy={isThinking}
          isComplete={isComplete}
          onAnswerChange={setAnswer}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
