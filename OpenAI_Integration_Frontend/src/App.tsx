import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<
    { prompt: string; response: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/getResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversation((prevConversation) => [...prevConversation, ...data]);
        setPrompt("");
        setLoading(false);
      } else {
        console.error("Error fetching response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="text-3xl mb-4 text-center bg-black text-white py-4 rounded-3xl">
        OpenAI Integration
      </div>
      <div className="conversation">
        {conversation.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="px-3">
              <div className="font-bold">You Asked:</div>
              <div className="mb-1">{entry.prompt}</div>
            </div>
            <div className="bg-slate-800 text-white py-8 px-3 my-2 rounded-3xl">
              <div className="font-bold">AI Replied:</div>
              <div>{entry.response}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-2 rounded-2xl border-black p-2 w-full"
          placeholder="Enter your question here"
        />
        <button
          type="submit"
          className="mt-2 py-3 font-medium text-lg px-16 rounded-2xl bg-blue-700 text-white"
        >
          Submit
        </button>
        {loading && <div>Loading...</div>}
      </form>
    </div>
  );
}

export default App;
