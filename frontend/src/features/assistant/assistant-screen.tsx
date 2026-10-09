"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bot, ChevronDown, FileUp, MessageSquarePlus, MoreHorizontal, PanelLeft, SendHorizontal, X } from "lucide-react";
import { AssistantBlocks } from "@/components/ai/assistant-blocks";
import { AssistantMessageContent } from "@/components/ai/assistant-message-content";
import { initialConversations, suggestedPrompts } from "@/data/conversations";
import { AssistantShortcuts } from "@/features/assistant/assistant-shortcuts";
import { cn } from "@/lib/utils";
import { assistantClient } from "@/features/assistant/assistant-client";
import type { ChatMessage, Conversation, TokenUsage } from "@/types/assistant";

const conversationDate = (value: string) => value.slice(5, 10).replace("-", "/");

// L'authentification fournira cet identifiant réel lorsqu'elle sera intégrée.
const DEMO_CLIENT_ID = "workspace-alex-morgan";

function formatTokenUsage(usage: TokenUsage) {
  // Une réponse conservée avant l'ajout du quota reste lisible au lieu de faire planter le chat.
  const quota = usage.quota ? ` · quota : ${usage.quota.usedTokens}/${usage.quota.limitTokens}` : "";
  return usage.source === "guardrail"
    ? `0 token Groq · demande filtrée${quota}`
    : `${usage.promptTokens} entrée · ${usage.completionTokens} sortie · ${usage.totalTokens} tokens${quota}`;
}

function AssistantMark({ className }: { className?: string }) {
  return <span className={cn("ai-mark grid size-7 shrink-0 place-items-center rounded-lg text-white", className)}><Bot className="size-3.5" /></span>;
}

export function AssistantScreen() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const active = useMemo(() => conversations.find((item) => item.id === activeId) ?? conversations[0], [activeId, conversations]);

  useEffect(() => {
    // Garde la dernière réponse visible sans créer une deuxième barre de défilement.
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: active.messages.length > 2 ? "smooth" : "auto" });
  }, [active.messages.length, isLoading]);

  const newConversation = () => {
    const next: Conversation = {
      id: crypto.randomUUID(),
      title: "New financial question",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
    setInput("");
    setServiceError(null);
    setSidebarOpen(false);
  };

  const selectConversation = (conversationId: string) => {
    setActiveId(conversationId);
    setServiceError(null);
    setSidebarOpen(false);
  };

  const submit = async (value = input) => {
    const content = value.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    // Affiche immédiatement le message de l’utilisateur pendant que FastAPI prépare la réponse.
    setConversations((current) => current.map((item) => item.id === activeId
      ? {
          ...item,
          title: item.messages.length ? item.title : content.slice(0, 34),
          messages: [...item.messages, userMessage],
          updatedAt: new Date().toISOString(),
        }
      : item,
    ));
    setInput("");
    setServiceError(null);
    setIsLoading(true);

    try {
      const response = await assistantClient.sendMessage({
        clientId: DEMO_CLIENT_ID,
        message: content,
        conversationId: activeId,
        // Le backend ajoute la question actuelle ; on envoie seulement les messages précédents pour éviter un doublon.
        history: active.messages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
      });
      setConversations((current) => current.map((item) => item.id === activeId
        ? { ...item, messages: [...item.messages, response.message], updatedAt: new Date().toISOString() }
        : item,
      ));
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : "Ledgerly AI could not respond just now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const history = (
    <>
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" aria-label="Return to workspace" title="Return to workspace" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-black/[.06] hover:text-foreground dark:hover:bg-white/[.08]">
          <ArrowLeft className="size-[17px]" />
        </Link>
        <span className="pr-1 text-xs font-medium tracking-[.02em] text-muted-foreground">YOUR WORKSPACE</span>
      </div>

      <button onClick={newConversation} className="mt-5 flex h-10 w-full items-center gap-2.5 rounded-lg bg-[#ececec] px-3 text-[13px] font-medium text-[#111827] hover:bg-[#e2e2e2] dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-[#ededed]">
        <MessageSquarePlus className="size-4" />
        Start a new chat
      </button>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <p className="px-2 text-[11px] font-medium text-muted-foreground">Recent</p>
        <div className="mt-2 space-y-0.5 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              className={cn(
                "group flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                conversation.id === activeId
                  ? "bg-black/[.09] text-foreground dark:bg-white/[.12]"
                  : "text-muted-foreground hover:bg-black/[.055] hover:text-foreground dark:hover:bg-white/[.07]",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{conversation.title}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{conversationDate(conversation.updatedAt)}</span>
              </span>
              <MoreHorizontal className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      <button className="mt-4 flex w-full items-center gap-2.5 rounded-lg border-t border-black/[.07] px-2 py-3 text-left hover:bg-black/[.055] dark:border-white/[.08] dark:hover:bg-white/[.07]">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#dedede] text-[11px] font-semibold text-[#525252] dark:bg-[#393939] dark:text-[#e5e5e5]">AM</span>
        <span className="min-w-0"><span className="block truncate text-[13px] font-medium">Alex Morgan</span><span className="block truncate text-[11px] text-muted-foreground">Personal workspace</span></span>
      </button>
    </>
  );

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden bg-white dark:bg-[#212121]">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#f7f7f8] p-3 dark:bg-[#171717] md:flex">
        {history}
      </aside>

      {sidebarOpen && (
        <div className="absolute inset-0 z-30 md:hidden">
          <button aria-label="Close conversation history" onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <aside className="relative flex h-full w-[285px] flex-col bg-[#f7f7f8] p-3 shadow-2xl dark:bg-[#171717]">
            <button onClick={() => setSidebarOpen(false)} aria-label="Close conversation history" className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-black/[.06] dark:hover:bg-white/[.08]"><X className="size-4" /></button>
            {history}
          </aside>
        </div>
      )}

      <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between px-3 sm:px-5">
          <div className="flex items-center gap-1">
            <button onClick={() => setSidebarOpen(true)} aria-label="Open conversation history" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-black/[.05] dark:hover:bg-white/[.07] md:hidden"><PanelLeft className="size-[17px]" /></button>
            <button className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium hover:bg-black/[.05] dark:hover:bg-white/[.07]">Ledgerly <span className="text-muted-foreground">Business</span><ChevronDown className="size-3.5 text-muted-foreground" /></button>
          </div>
          <button className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-black/[.05] dark:hover:bg-white/[.07]" aria-label="Conversation options"><MoreHorizontal className="size-[18px]" /></button>
        </header>

        <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[760px] px-5 pb-64 pt-7 sm:px-8 sm:pt-10">
            {active.messages.length === 0 ? (
              <div className="flex min-h-[calc(100vh-15rem)] flex-col justify-center pb-12">
                <AssistantMark className="mx-auto size-10 rounded-xl shadow-[0_8px_24px_rgba(99,91,255,.28)]" />
                <h1 className="mt-5 text-center text-3xl font-semibold tracking-[-.055em] sm:text-[34px]">What would you like to understand?</h1>
                <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-6 text-muted-foreground">Ask about finance, sales, marketing, operations, strategy, or your Ledgerly workspace.</p>
                <div className="mx-auto mt-8 grid w-full max-w-[680px] gap-2.5 sm:grid-cols-2">
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt.id} onClick={() => submit(prompt.label)} className="rounded-xl border border-black/[.08] bg-white p-3.5 text-left hover:bg-[#f7f7f7] dark:border-white/[.10] dark:bg-[#2a2a2a] dark:hover:bg-[#303030]">
                      <p className="font-medium tracking-[-.01em]">{prompt.label}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{prompt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-9 pb-4">
                {active.messages.map((message) => (
                  <article key={message.id} className={message.role === "user" ? "ml-auto max-w-[84%] sm:max-w-[70%]" : "max-w-full"}>
                    {message.role === "assistant" ? (
                      <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-3.5 sm:gap-4">
                        <AssistantMark />
                        <div className="min-w-0 pt-0.5">
                          <div className="mb-2 flex items-center gap-2"><p className="text-sm font-semibold">Ledgerly</p><span className="text-[11px] text-muted-foreground">Financial intelligence</span></div>
                          <div className="text-[15px] leading-7 text-foreground"><AssistantMessageContent content={message.content} />{message.blocks && <AssistantBlocks blocks={message.blocks} />}</div>
                          {message.usage && (
                            // Ce résumé correspond aux tokens de la réponse générée pour ce prompt.
                            <p
                              className="mt-3 text-[11px] leading-4 text-muted-foreground"
                              title={message.usage.source === "groq" ? "Les tokens d’entrée incluent le contexte et les instructions système." : "La demande a été filtrée avant l’appel à Groq."}
                            >
                              {formatTokenUsage(message.usage)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[20px] bg-[#f0f0f0] px-4 py-2.5 text-[15px] leading-7 text-foreground dark:bg-[#303030]">{message.content}</div>
                    )}
                  </article>
                ))}

                {isLoading && (
                  <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-3.5 sm:gap-4" aria-live="polite">
                    <AssistantMark />
                    <div className="flex h-7 items-center gap-1.5 pt-0.5" aria-label="Ledgerly is thinking"><i className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70" /><i className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:120ms]" /><i className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:240ms]" /></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white from-55% via-white/95 to-transparent px-4 pb-3 pt-16 dark:from-[#212121] dark:via-[#212121]/95 sm:px-6 sm:pb-4">
          <div className="mx-auto max-w-[760px]">
            <AssistantShortcuts disabled={isLoading} onSelect={submit} />
            {serviceError && <div role="alert" className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-negative/25 bg-negative/10 px-3 py-2 text-xs text-foreground"><span>{serviceError}</span><button onClick={() => setServiceError(null)} aria-label="Dismiss error" className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button></div>}
            <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex items-end gap-2 rounded-[25px] border border-black/[.10] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,.08)] transition-shadow focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_rgba(99,91,255,.13)] dark:border-white/[.12] dark:bg-[#2f2f2f] dark:shadow-[0_8px_30px_rgba(0,0,0,.20)]">
              <button type="button" aria-label="Attach document" className="mb-0.5 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-black/[.06] hover:text-foreground dark:hover:bg-white/[.08]"><FileUp className="size-[17px]" /></button>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={1} placeholder="Ask about your business" className="max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} />
              <button disabled={!input.trim() || isLoading} aria-label="Send message" className="mb-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#1f1f1f] text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#e6e6e6] disabled:text-[#9b9b9b] dark:bg-white dark:text-[#202020] dark:hover:bg-[#e7e7e7] dark:disabled:bg-[#444] dark:disabled:text-[#777]"><SendHorizontal className="size-4" /></button>
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Ledgerly can make mistakes. Verify important financial decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
