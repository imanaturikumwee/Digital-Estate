import React, { useState, useEffect, useRef } from 'react';
import { Property, ChatThread, ChatMessage, User } from '../types/index.js';

interface ChatScreenProps {
  currentUser: User | null;
  activePropertyContext?: Property | null;
  onBookViewing?: (property: Property) => void;
  onOpenValuation?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  currentUser,
  activePropertyContext,
  onBookViewing,
  onOpenValuation,
}) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default fallback threads
  const initialThreads: ChatThread[] = [
    {
      id: 'thread-1',
      participantName: 'Dany Mugisha',
      participantRole: 'Senior Architect & Partner',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
      online: true,
      lastMessage: 'I reviewed the floorplans for Kigali View Heights. The foundation permits are validated.',
      lastMessageTime: '10:42 AM',
      unreadCount: 0,
      tag: 'Kigali View Heights',
      propertyContext: {
        id: 'prop-1',
        title: 'Kigali View Heights',
        price: '$450,000',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
      },
    },
    {
      id: 'thread-2',
      participantName: 'Emma Umutoni',
      participantRole: 'Managing Director & Notary Liaison',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
      online: true,
      lastMessage: 'The Bugesera zoning certificate has been updated with the Rwanda Land Authority.',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      tag: 'Bugesera Industrial',
      propertyContext: {
        id: 'prop-2',
        title: 'Bugesera Industrial Plot',
        price: '$120,000',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzX8KJ39U9HLMpeIoVllGed8qJ1WR-uqDyJxjsSVCEQ2TaEqOuzVbM92tynbPesQlFg8jpxkT0c2kfHFfHccOvvVzQ-X3dxZOZoalo6_1TxRiyvQDJCJcvcZEfM0Ghns-1qdMHjBkKlU9Of8lDCcQ_L-ibZjsw4b9LEkaIO_QmzXxlzY-ps5rlVMFIuJZ6stolQNU6fibjYs8eG7tVHlhC5bt4MM-AW0_Gu83p9vSOEkAKbG-1KtW81fISQanEbSMSoHIX4nMg6Vg',
      },
    },
    {
      id: 'thread-3',
      participantName: 'AI Rwandan Property Evaluator',
      participantRole: 'Automated Investment Concierge',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3_a38jX_k4zL81lV0o_mN2zYt9uQeWw8vV4mK3a5yX7_2mP9oQ-1rSt7uVw8xYzAbCdEfGhIjKlMnOpQrStUvWxYz',
      online: true,
      lastMessage: 'Your custom portfolio evaluation report is ready for download.',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      tag: 'Automated Agent',
    },
  ];

  // Fetch threads from backend
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch('/api/chats');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setThreads(data);
            setActiveThreadId(data[0].id);
            return;
          }
        }
      } catch {
        // Fallback to initial threads
      }
      setThreads(initialThreads);
    };

    fetchThreads();
  }, []);

  // Fetch messages for active thread
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chats/${activeThreadId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback mock messages
      }

      // Mock conversation with AI Scorecard
      setMessages([
        {
          id: 'msg-1',
          chatId: activeThreadId,
          sender: 'agent',
          senderName: 'Dany Mugisha',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
          text: 'Hello! Welcome to Emma & Dany Luxury Realty. I am Dany Mugisha, lead architectural advisor. I generated an automated investment scorecard for the property you are reviewing.',
          timestamp: '10:30 AM',
          aiScoreCard: {
            score: 94,
            growthPotential: '+12.4% /yr projected 5-year CAGR',
            riskLevel: 'Very Low',
            rationale: 'Kigali View Heights benefits from prime ridge elevation in Rebero with master-planned infrastructure and direct asphalt access. 100% Freehold title verified in Rwanda Land Management and Information System (RLMIS).',
          },
        },
        {
          id: 'msg-2',
          chatId: activeThreadId,
          sender: 'agent',
          senderName: 'Dany Mugisha',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
          text: 'Would you like to review the official title deed or book an executive chauffeur viewing this Saturday?',
          timestamp: '10:32 AM',
        },
      ]);
      setLoading(false);
    };

    fetchMessages();
  }, [activeThreadId]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: activeThreadId,
      sender: 'user',
      senderName: currentUser?.name || 'Investor',
      senderAvatar:
        currentUser?.avatarUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch(`/api/chats/${activeThreadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });

      if (res.ok) {
        const reply = await res.json();
        setMessages((prev) => [...prev, reply]);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // Simulate realistic intelligent agent response
      setTimeout(() => {
        let replyText = "Thank you for inquiring. I have notified our legal and architectural desk in Kigali. We've logged this in our VIP concierge pipeline.";
        let card = undefined;

        if (textToSend.toLowerCase().includes('viewing') || textToSend.toLowerCase().includes('schedule')) {
          replyText = "I would be thrilled to host you for a private viewing. Our Mercedes V-Class chauffeur can pick you up from Kigali International Airport or your hotel in Kiyovu.";
        } else if (textToSend.toLowerCase().includes('title') || textToSend.toLowerCase().includes('deed')) {
          replyText = "The digital deed has been authenticated with UPI (Unique Parcel Identifier) 1/03/08/04/1239. Clear freehold with zero encumbrances.";
        } else if (textToSend.toLowerCase().includes('yield') || textToSend.toLowerCase().includes('roi')) {
          replyText = "At current market rates in Rebero, comparable furnished villas yield $3,800 to $4,500/month on luxury expatriate executive leases, offering an estimated 9.8% to 11.2% net yield.";
          card = {
            score: 95,
            growthPotential: '11.2% Net Rental Yield',
            riskLevel: 'Very Low',
            rationale: 'High demand from diplomatic corps and international tech headquarters located in Kigali.',
          };
        }

        const agentReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          chatId: activeThreadId,
          sender: 'agent',
          senderName: 'Emma Umutoni & Dany Mugisha',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiScoreCard: card,
        };

        setMessages((prev) => [...prev, agentReply]);
      }, 700);
    } finally {
      setSending(false);
    }
  };

  const activeThread = threads.find((t) => t.id === activeThreadId) || initialThreads[0];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in duration-300">
      {/* Threads Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-headline text-slate-900 dark:text-white">
              Concierge Inquiries
            </h2>
            <p className="text-[11px] text-slate-500 font-label">
              Direct line to Dany Mugisha &amp; Emma Umutoni
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Agents Online" />
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 ${
                  isSelected ? 'bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-blue-900 dark:border-blue-500' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.participantAvatar}
                    alt={thread.participantName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-headline truncate">
                      {thread.participantName}
                    </h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium truncate">
                    {thread.participantRole}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {thread.lastMessage}
                  </p>

                  {thread.tag && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {thread.tag}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
        {/* Active conversation header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src={activeThread.participantAvatar}
              alt={activeThread.participantName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-headline">
                  {activeThread.participantName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  Active Now
                </span>
              </div>
              <p className="text-xs text-slate-500">{activeThread.participantRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenValuation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold font-headline"
            >
              <span className="material-symbols-outlined text-sm">calculate</span>
              Run Valuation
            </button>
            {activePropertyContext && onBookViewing && (
              <button
                onClick={() => onBookViewing(activePropertyContext)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-900 dark:bg-blue-600 text-white hover:opacity-90 text-xs font-bold font-headline shadow-sm"
              >
                Book Chauffeur Viewing
              </button>
            )}
          </div>
        </div>

        {/* Property Context Strip */}
        {(activeThread.propertyContext || activePropertyContext) && (
          <div className="bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  activePropertyContext?.imageUrl ||
                  activeThread.propertyContext?.image ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP'
                }
                alt="Property thumbnail"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activePropertyContext?.title || activeThread.propertyContext?.title}
                </p>
                <p className="text-[11px] text-slate-500 font-label">
                  {activePropertyContext?.formattedPrice || activeThread.propertyContext?.price} · Rebero, Kigali
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                Title Deed Verified
              </span>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="material-symbols-outlined text-3xl animate-spin text-blue-900">
                progress_activity
              </span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />

                  <div className={`max-w-[85%] sm:max-w-md space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm font-body leading-relaxed ${
                        isMe
                          ? 'bg-blue-900 dark:bg-blue-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Rich AI Scorecard Attachment */}
                    {msg.aiScoreCard && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-800/40 shadow-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400 text-lg">
                              auto_awesome
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider font-headline text-blue-200">
                              AI Rwandan Property Scorecard
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/40">
                            {msg.aiScoreCard.score} / 100
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-400 text-[10px] block">Capital Growth</span>
                            <span className="font-bold text-blue-300 font-headline">
                              {msg.aiScoreCard.growthPotential}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-400 text-[10px] block">Risk Profile</span>
                            <span className="font-bold text-emerald-300 font-headline">
                              {msg.aiScoreCard.riskLevel}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-normal bg-black/20 p-2.5 rounded-lg border border-white/5">
                          {msg.aiScoreCard.rationale}
                        </p>

                        <div className="pt-1 flex gap-2">
                          <button
                            onClick={() => handleSendMessage('Can you break down the 10-year rental yield forecast for this?')}
                            className="text-[10px] text-blue-300 hover:text-white underline font-bold"
                          >
                            Ask for Yield Forecast →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Quick Inquiries:
          </span>
          <button
            onClick={() => handleSendMessage('Can I schedule a private weekend viewing with chauffeur?')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] whitespace-nowrap font-medium"
          >
            Schedule VIP Viewing 🚗
          </button>
          <button
            onClick={() => handleSendMessage('Please share the verified UPI and RLMIS title registration deed.')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] whitespace-nowrap font-medium"
          >
            Send Title Deed 📑
          </button>
          <button
            onClick={() => handleSendMessage('What is the projected net rental yield and expatriate tenant demand?')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] whitespace-nowrap font-medium"
          >
            Calculate 10-Year Yield 📈
          </button>
        </div>

        {/* Message Input Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Dany &amp; Emma anything about Rwandan titles, building codes, or pricing..."
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="px-5 py-3 rounded-xl bg-blue-900 dark:bg-blue-600 text-white font-headline text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
