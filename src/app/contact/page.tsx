'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useLanguage } from '@/i18n/LanguageContext';
import { Send, MessageSquare, Clock, Mail } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `姓名：${form.name}\n邮箱：${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:1902243211@qq.com?subject=${encodeURIComponent(form.subject)}&body=${body}`;
    setSent(true);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            联系我们
          </h1>
          <p className="text-text2">
            有任何问题、建议或合作意向，欢迎通过以下方式联系我们。通常会在 1-3 个工作日内回复。
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-6 bg-bg2 border border-border-site rounded-[24px] text-center space-y-3">
            <Mail className="w-8 h-8 text-primary mx-auto" />
            <p className="font-bold">邮件联系</p>
            <p className="text-sm text-text-muted">1902243211@qq.com</p>
          </div>
          <div className="p-6 bg-bg2 border border-border-site rounded-[24px] text-center space-y-3">
            <Clock className="w-8 h-8 text-primary mx-auto" />
            <p className="font-bold">响应时间</p>
            <p className="text-sm text-text-muted">1-3 个工作日</p>
          </div>
          <div className="p-6 bg-bg2 border border-border-site rounded-[24px] text-center space-y-3">
            <Send className="w-8 h-8 text-primary mx-auto" />
            <p className="font-bold">合作洽谈</p>
            <p className="text-sm text-text-muted">欢迎广告与商务合作</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-bg2 border border-border-site rounded-[32px] p-8 space-y-6">
          <h2 className="text-xl font-black">发送消息</h2>
          {sent ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-green-500 font-bold text-lg">✓ 邮件客户端已打开</p>
              <p className="text-sm text-text-muted">请在您的邮件应用中完成发送，我们会尽快回复您。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="您的姓名（选填）"
                  className="w-full px-5 py-3 bg-bg1 border border-border-site rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="您的邮箱（必填）"
                  required
                  className="w-full px-5 py-3 bg-bg1 border border-border-site rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="邮件主题"
                required
                className="w-full px-5 py-3 bg-bg1 border border-border-site rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
              <textarea
                placeholder="请详细描述您的问题或建议..."
                required
                rows={6}
                className="w-full px-5 py-3 bg-bg1 border border-border-site rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                发送邮件
              </button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}