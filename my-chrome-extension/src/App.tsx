import React from "react";

import { useState, useRef, useEffect } from "react";
import { Message } from "../src/types/message";
import { Send } from "react-feather";



const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<Message[]>([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstMessage, setFirstMessage] = useState<boolean>(true)
  const [secondMessage, setSecondMessage] = useState<boolean>(false)
  const [inputArea , setinputArea] = useState<boolean>(false)


  const handleClickButtonOne = () =>{
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: "Give me similler issues"},
    ]);
    setMessage("")
    setLoading(true)
    setFirstMessage(false);

    fetch("http://127.0.0.1:8000/generate?prompt=" + "hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message, history: history }),
    }).then(async (res) => {
        const r = await res.json();
        setHistory((oldHistory) => [...oldHistory, r]);
        setLoading(false);
        setFirstMessage(false);
        setSecondMessage(true);
    }).catch((err) => {
      console.error("Test : " + err)
      setHistory((oldHistory) => [
        ...oldHistory,
        { role: "assistant", content: "There is a server error please try again"},
      ]);
      setLoading(false);
      setFirstMessage(true);
    });
    
  }

  const handleClickButtonTwo = () =>{
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: "Give the intial suggestions"},
    ]);
    setMessage("")
    setLoading(true)
    setSecondMessage(false);
    fetch("http://127.0.0.1:8000/generate?prompt=" + "hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message, history: history }),
    }).then(async (res) => {
        const r = await res.json();
        setHistory((oldHistory) => [...oldHistory, r]);
        setLoading(false);
        setSecondMessage(false);
        setinputArea(true);
    }).catch((err) => {
      console.error("Test : " + err)
      setHistory((oldHistory) => [
        ...oldHistory,
        { role: "assistant", content: "There is a server error please try again"},
      ]);
      setLoading(false);
      setSecondMessage(true);
    });
    
  }


  const handleClick = () => {
    if (message == "") return;
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);
    fetch("http://127.0.0.1:8000/generate?prompt="+ message, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message, history: history }),
    }).then(async (res) => {
        const r = await res.json();
        setHistory((oldHistory) => [...oldHistory, r]);
        setLoading(false);
    }).catch((err) => {
      console.error("Test : " + err)
      setHistory((oldHistory) => [
        ...oldHistory,
        { role: "assistant", content: "There is a server error please try again"},
      ]);
      setLoading(false);
    });
  };

  const formatPageName = (url: string) => {
    // Split the URL by "/" and get the last segment
    const pageName = url.split("/").pop();

    // Split by "-" and then join with space
    if (pageName) {
      const formattedName = pageName.split("-").join(" ");

      // Capitalize only the first letter of the entire string
      return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    }
  };
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <main className="h-screen bg-white p-6 flex flex-col">
        <form onSubmit={(e) => { e.preventDefault(); handleClick();}}>
          <div className="">
          {history.map((message: Message, idx) => {
              const isLastMessage = idx === history.length - 1;
              switch (message.role) {
                case "assistant":
                  return (
                    <div
                      ref={isLastMessage ? lastMessageRef : null}
                      key={idx}
                      className="flex gap-2"
                    >
                      <img
                        src="images/assistant-avatar.png"
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                        <p className="text-sm font-medium text-violet-500 mb-2">
                          AI assistant
                        </p>
                        {message.content}
                        {message.links && (
                          <div className="mt-4 flex flex-col gap-2">
                            <p className="text-sm font-medium text-slate-500">
                              Sources:
                            </p>

                            {message.links?.map((link) => {
                              return (
                                <a
                                  href={link}
                                  key={link}
                                  className="block w-fit px-2 py-1 text-sm  text-violet-700 bg-violet-100 rounded"
                                >
                                  {formatPageName(link)}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                case "user":
                  return (
                    <div
                      className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tl-xl text-black p-6 self-end shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                      key={idx}
                      ref={isLastMessage ? lastMessageRef : null}
                    >
                      <p className="text-sm font-medium text-violet-500 mb-2">
                        You
                      </p>
                      {message.content}
                    </div>
                  );
              }
            })}
          </div>

          <div className="">
              {firstMessage && <div> <button onClick={(e) => {
                  e.preventDefault();
                  handleClickButtonOne();
                }}>Give similar issues</button></div>}
          </div>
          <div className="">
              {secondMessage && <div> <button onClick={(e) => {
                  e.preventDefault();
                  handleClickButtonTwo();
                }}>Give intial suggestions</button></div>}
          </div>

          <div> { inputArea && 
            <div>
              <label>Input area </label>
              {/* input area */}
          
              <textarea aria-label="chat input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleClick();
                  }
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
                className="flex w-14 h-14 items-center justify-center rounded-full px-3 text-sm  bg-violet-600 font-semibold text-white hover:bg-violet-700 active:bg-violet-800 absolute right-2 bottom-2 disabled:bg-violet-100 disabled:text-violet-400"
                type="submit"
                aria-label="Send"
                disabled={!message || loading  }
              >
                <Send />
              </button>
            </div>
            }
          </div>
        </form>
    </main>
  );
};

export default App;
