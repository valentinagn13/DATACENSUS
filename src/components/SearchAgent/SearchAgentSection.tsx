import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import { Sparkles, Send, Loader2, User, Bot } from "lucide-react";
=======
import { Sparkles, Send, Loader2, User, Bot, ChevronDown } from "lucide-react";
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
<<<<<<< HEAD
=======
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const SearchAgentSection = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
<<<<<<< HEAD
=======
  const [iframeDatasetId, setIframeDatasetId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions] = useState([
    "Datasets sobre educación con actualización reciente",
    "Análisis de calidad de datasets de salud pública",
    "Datasets con más de 10,000 registros",
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

<<<<<<< HEAD
=======
  // Cuando se abre el iframe, desplazarse hacia él
  useEffect(() => {
    if (iframeDatasetId) {
      // Give DOM a moment to render the iframe container
      setTimeout(() => {
        iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [iframeDatasetId]);

>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    
    const userMessage = query;
    setQuery("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("https://uzuma.duckdns.org/webhook/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: userMessage
        }),
      });

      if (!res.ok) {
        throw new Error("Error al conectar con el agente");
      }

      const data = await res.json();
      if (data && data[0] && data[0].output) {
<<<<<<< HEAD
=======
        // debug: log raw output and normalized preview
        try {
          const raw = data[0].output;
          const norm = formatMarkdownPreserveLineBreaks(raw);
          // eslint-disable-next-line no-console
          console.debug("Agent raw output:", raw);
          // eslint-disable-next-line no-console
          console.debug("Agent normalized preview:\n", norm.substring(0, 1000));
        } catch (e) {
          // ignore
        }
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
        setMessages(prev => [...prev, { role: "assistant", content: data[0].output }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
<<<<<<< HEAD
=======
  };

  const extractDatasetIds = (text: string): string[] => {
    // Match all occurrences like ///abcd-efgh anywhere in the text
    const re = /\/\/\/([a-z0-9\-]+)/gi;
    const ids: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const id = m[1];
      if (!ids.includes(id)) ids.push(id);
    }
    return ids;
  };

  const formatMarkdownPreserveLineBreaks = (text: string) => {
    if (!text) return text;
    // If the agent returned escaped newlines (literal backslash+n), convert them into real newlines.
    // Some agents double-escape, so run iteratively a few times to unescape sequences like "\\\\n" → "\\n" → "\n".
    let t = String(text);
    const maxIters = 5;
    for (let i = 0; i < maxIters; i++) {
      const prev = t;
      t = t.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
      // also convert any remaining literal escaped CR/LF
      t = t.replace(/\\r/g, "\r");
      // stop early if no change
      if (t === prev) break;
    }
    // Normalize real CRLF to LF
    t = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    // Return normalized text and let remark-breaks handle single newlines and paragraphs
    return t;
  };

  const renderMarkdownParagraphs = (text: string) => {
    if (!text) return null;
    // Split on two or more newlines (possibly with spaces) to preserve paragraphs
    const paragraphs = text.split(/\n\s*\n+/g);
    return paragraphs.map((p, idx) => (
      <div key={idx} className={idx < paragraphs.length - 1 ? 'mb-3' : ''}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{p}</ReactMarkdown>
      </div>
    ));
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
  };

  return (
    <div className="flex flex-col w-full h-full bg-white/30 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl shadow-gray-500/10">
      {/* Header interno del chat */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-white/20 bg-white/40 backdrop-blur-sm px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Agente de Búsqueda IA
              </h1>
              <p className="text-sm text-gray-500">
                Encuentra datasets de calidad
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Area - Con scroll mejorado */}
<<<<<<< HEAD
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/20 to-white/10">
=======
      <div className="flex-1 relative overflow-y-auto bg-gradient-to-b from-white/20 to-white/10">
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-4 py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ¿En qué puedo ayudarte?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Escribe tu consulta o selecciona uno de los ejemplos
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-2xl text-sm text-gray-700 transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
<<<<<<< HEAD
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-3xl px-5 py-4 transition-all duration-200 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white text-gray-900 shadow-md shadow-gray-500/10 border border-gray-100"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

=======
                {messages.map((message, idx) => {
                  const ids = message.role === 'assistant' ? extractDatasetIds(message.content) : [];
                  const multiple = ids.length > 1;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-3xl px-5 py-4 transition-all duration-200 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-white text-gray-900 shadow-md shadow-gray-500/10 border border-gray-100"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100">
                            {renderMarkdownParagraphs(formatMarkdownPreserveLineBreaks(message.content))}
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}

                        {ids.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {multiple && (
                              <div className="text-sm text-gray-600">¿Deseas ver métricas para alguno de estos IDs detectados?</div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {ids.map((id) => (
                                <div key={id} className="flex items-center gap-2">
                                  <button
                                    onClick={() => setIframeDatasetId(id)}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold"
                                  >
                                    Ver métricas: {id}
                                  </button>
                                  <a
                                    href={`${window.location.origin}/?dataset_id=${id}&embed=0`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:underline"
                                  >
                                    Abrir en nueva pestaña
                                  </a>
                                  <button
                                    onClick={() => { /* Omitir: no action, simply provide control */ }}
                                    className="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded-md"
                                  >
                                    Omitir
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {iframeDatasetId && (
                  <div ref={iframeRef} className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                      <div className="text-sm text-cyan-100 font-semibold">Vista previa del dataset: {iframeDatasetId}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIframeDatasetId(null)}
                          className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg"
                        >
                          Volver al chat
                        </button>
                        <a
                          href={`${window.location.origin}/?dataset_id=${iframeDatasetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-lg"
                        >
                          Abrir en nueva pestaña
                        </a>
                      </div>
                    </div>
                  <div style={{ height: 420 }} className="w-full">
                    <iframe
                      title={`dataset-${iframeDatasetId}`}
                      src={`${window.location.origin}/?dataset_id=${iframeDatasetId}&embed=1`}
                      className="w-full h-full border-0"
                    />
                  </div>
                  </div>
                )}

                {/* Flecha indicadora: visible cuando hay iframe abierto */}
                {iframeDatasetId && (
                  <button
                    onClick={() => iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    title="Baja un poco para ver la vista previa"
                    className="absolute right-6 bottom-36 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-sm text-cyan-100">Baja para ver</span>
                    <ChevronDown className="w-5 h-5 text-cyan-300 animate-bounce" />
                  </button>
                )}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Input
              placeholder="Escribe tu mensaje..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-14 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl text-gray-900 placeholder:text-gray-500 shadow-sm text-base px-4 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-blue-500/20 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
