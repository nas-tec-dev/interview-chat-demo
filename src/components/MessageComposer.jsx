export default function MessageComposer({
  answer,
  isBusy,
  isComplete,
  onAnswerChange,
  onSubmit,
}) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  }

  return (
    <form className="composer" onSubmit={onSubmit}>
      <textarea
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="回答を入力してください…"
        rows={3}
        aria-label="面接の回答"
        disabled={isBusy || isComplete}
      />
      <div className="composer-actions">
        <button
          className="send-button"
          type="submit"
          disabled={!answer.trim() || isBusy || isComplete}
        >
          {isBusy ? '送信中…' : '送信'}
        </button>
      </div>
    </form>
  );
}
