const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

async function postJson(path, requestBody) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(requestBody),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(
      responseBody.error?.message || 'Python APIへの通信に失敗しました。',
    );
  }

  return responseBody.data;
}

export function createInterviewSession(requestId) {
  return postJson('/api/v1/interview-sessions', {
    request_id: requestId,
    data: {
      interviewer_persona_id: 'tanaka',
    },
  });
}

export function sendInterviewMessage(sessionId, message, requestId) {
  return postJson(
    `/api/v1/interview-sessions/${encodeURIComponent(sessionId)}/messages`,
    {
      request_id: requestId,
      data: {
        message,
      },
    },
  );
}
