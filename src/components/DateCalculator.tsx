import React, { useState, useEffect } from 'react';
import { Calendar, Heart, PartyPopper, ChevronRight, Clock, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

interface Event {
  id: string;
  name: string;
  date: string;
  type: 'countdown' | 'anniversary';
}

export const DateCalculator: React.FC = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const faqs = [
    {
      question: {
        en: 'What types of events can I track?',
        zh: '可以跟踪哪些类型的事件？'
      },
      answer: {
        en: 'You can track countdowns to future dates (like birthdays, holidays) and anniversaries from past dates (like how long you have been together).',
        zh: '您可以跟踪未来日期的倒计时（如生日、假期）和过去日期的纪念日（如在一起多久了）。'
      }
    },
    {
      question: {
        en: 'Are my events saved?',
        zh: '我的事件会保存吗？'
      },
      answer: {
        en: 'Events are saved in your browser local storage, so they persist between sessions. Clearing browser data will remove them.',
        zh: '事件保存在浏览器本地存储中，因此它们在会话之间持续存在。清除浏览器数据将删除它们。'
      }
    },
    {
      question: {
        en: 'Can I delete events?',
        zh: '可以删除事件吗？'
      },
      answer: {
        en: 'Yes, you can delete any event by clicking the trash icon next to it. You can also add unlimited events.',
        zh: '是的，您可以点击事件旁边的垃圾桶图标删除任何事件。您还可以添加无限数量的事件。'
      }
    }
  ];

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('momo-date-events');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: isZh ? '春节' : 'New Year', date: '2025-01-29', type: 'countdown' },
      { id: '2', name: isZh ? '在一起' : 'Together', date: '2023-05-20', type: 'anniversary' }
    ];
  });

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<'countdown' | 'anniversary'>('countdown');

  useEffect(() => {
    localStorage.setItem('momo-date-events', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!newName || !newDate) return;
    const newEvent: Event = {
      id: Date.now().toString(),
      name: newName,
      date: newDate,
      type: newType
    };
    setEvents([newEvent, ...events]);
    setNewName('');
    setNewDate('');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const calculateDays = (date: string) => {
    const target = new Date(date).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    const diff = target - now;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '日期计算器可以帮助您追踪重要日期的倒计时和纪念日。支持添加多个事件，自动计算距离目标日期的天数。数据会保存在本地存储中，下次访问时自动加载。适用于生日、纪念日、考试倒计时、项目截止日期等各种场景。界面简洁直观，一目了然地查看所有重要日期的剩余天数。'
            : 'The date calculator helps you track countdowns and anniversaries for important dates. Supports adding multiple events and automatically calculates the number of days remaining until the target date. Data is saved in local storage and automatically loaded on next visit. Suitable for birthdays, anniversaries, exam countdowns, project deadlines, and various other scenarios. The interface is simple and intuitive, showing the remaining days for all important dates at a glance.'}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-secondary-site border border-border-site rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-text-site flex items-center gap-2">
           <Plus className="w-5 h-5 text-primary" />
           {isZh ? '新增纪念日 / 倒计时' : 'Add New Event'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <input 
             type="text" 
             placeholder={isZh ? '事件名称 (如: 生日)' : 'Event Name'}
             value={newName}
             onChange={(e) => setNewName(e.target.value)}
             className="md:col-span-1 p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary"
           />
           <input 
             type="date" 
             value={newDate}
             onChange={(e) => setNewDate(e.target.value)}
             className="md:col-span-1 p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary"
           />
           <div className="flex gap-1 p-1 bg-card-bg border border-border-site rounded-xl">
              <button 
                onClick={() => setNewType('countdown')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${newType === 'countdown' ? 'bg-primary text-white' : 'text-text-site/50'}`}
              >
                {isZh ? '倒计时' : 'Countdown'}
              </button>
              <button 
                onClick={() => setNewType('anniversary')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${newType === 'anniversary' ? 'bg-primary text-white' : 'text-text-site/50'}`}
              >
                {isZh ? '纪念日' : 'Anniversary'}
              </button>
           </div>
           <button 
             onClick={addEvent}
             className="bg-primary text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
             {isZh ? '确认添加' : 'Confirm'}
           </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const days = calculateDays(event.date);
          const isPast = days < 0;
          const displayDays = Math.abs(days);

          return (
            <div key={event.id} className="relative group bg-card-bg border border-border-site rounded-3xl p-6 shadow-sm hover:shadow-md transition-all overflow-hidden">
               {/* Background Decorative Icon */}
               <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0">
                  {event.type === 'anniversary' ? <Heart className="w-32 h-32" /> : <Clock className="w-32 h-32" />}
               </div>

               <button 
                 onClick={() => deleteEvent(event.id)}
                 className="absolute top-4 right-4 p-2 text-text-site/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
               >
                 <Trash2 className="w-4 h-4" />
               </button>

               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <div className={`p-2 rounded-lg ${event.type === 'anniversary' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {event.type === 'anniversary' ? <Heart className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                     </div>
                     <span className="text-sm font-bold text-text-site/70">{event.name}</span>
                  </div>

                  <div className="flex flex-col">
                     <span className="text-4xl font-mono font-black text-text-site tracking-tighter">
                        {displayDays}
                     </span>
                     <span className="text-xs font-bold text-text-site/40 uppercase tracking-widest mt-1">
                        {isZh ? (event.type === 'anniversary' ? '天之前 (已过去)' : (isPast ? '天已过' : '天剩余')) : 'Days'}
                     </span>
                  </div>

                  <div className="pt-4 border-t border-border-site/50 flex justify-between items-center text-[10px] text-text-site/40 font-bold uppercase tracking-widest">
                     <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.date}
                     </div>
                     <ChevronRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Share Quote */}
      <div className="text-center space-y-2 py-8">
         <PartyPopper className="w-8 h-8 text-primary mx-auto opacity-50" />
         <p className="text-sm text-text-site/50 italic">
            {isZh ? '有些日子值得被永远记住。' : '"Some days are worth remembering forever."'}</p>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
