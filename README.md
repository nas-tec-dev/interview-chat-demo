# 面談チャット画面サンプル

Interviaの面談画面を独立して確認するためのReact + Pythonサンプルです。ReactがPython APIへ面談開始と回答をPOSTし、Pythonが決められた質問・リアクションを返します。

## 起動方法

Pythonは8002番ポート、Reactは5175番ポートで起動します。

### React画面

```powershell
cd samples/interview-chat-demo
npm install
npm run dev
```

Viteが表示するURLをブラウザで開いてください。画面表示時にPython APIへ面談開始のPOSTを行い、返信の挨拶と最初の質問を表示します。質問に回答するとPythonから次の定型メッセージが返ります。

## 通信内容

面談画面を表示するとReactが `POST /api/v1/interview-sessions` を呼び出します。PythonはセッションIDと、挨拶・最初の質問を含む面接官メッセージを返します。画面上の面接官メッセージは、開始時も回答後もすべてPython APIのレスポンスから表示します。各回答は `POST /api/v1/interview-sessions/{session_id}/messages` へ送信します。

面談開始時の本文は次の形式です。

```json
{
  "request_id": "51a7631a-9307-4916-b5bd-4a8f6416c21f",
  "data": {
    "interviewer_persona_id": "tanaka"
  }
}
```

```json
{
  "request_id": "9c38b9e3-624b-4b4c-85c6-5129ea2b2d96",
  "data": {
    "message": "APIの応答速度が遅い問題を改善しました。"
  }
}
```

Pythonは次の質問を共通レスポンス形式で返します。

```json
{
  "request_id": "9c38b9e3-624b-4b4c-85c6-5129ea2b2d96",
  "data": {
    "message_id": "msg_1",
    "interviewer_message": {
      "text": "ありがとうございます。担当範囲を具体的に説明いただけました。 そのプロジェクトで最も難しかった課題は何でしたか？どのように解決へ進めましたか？",
      "aside": "（メモを取りながら、少し身を乗り出す）"
    },
    "stage": "課題の深掘り",
    "is_complete": false
  },
  "error": null
}
```

## デモの範囲

- 面接官の表情・口調を示すト書き付きチャット
- 複数の固定質問と回答入力
- Python APIとのセッション開始・回答送信
- 回答送信ボタン
