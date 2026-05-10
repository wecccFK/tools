import { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: '服务条款 | MOMO工具箱',
  description: '了解使用 MOMO工具箱 的服务条款、法律声明与使用规范。',
};

export default function TermsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">服务条款</h1>
          <p className="text-text-muted">最后更新：2026年4月20日</p>
        </div>

        <div className="space-y-10">
          {[
            {
              title: '服务说明',
              content: 'MOMO工具箱（web-tools.top）是一个提供免费在线工具的平台。所有工具均在您的浏览器本地执行，我们不会将您输入的数据上传至服务器（AI 相关工具除外）。我们保留随时修改、暂停或终止任何服务的权利，恕不另行通知。'
            },
            {
              title: '使用规范',
              content: '您同意不利用本服务从事任何违法活动，不使用本服务进行任何可能损害、干扰或未经授权访问他人系统或数据的行为。严禁利用本平台生成违法、侵权、欺诈或恶意内容。'
            },
            {
              title: '知识产权',
              content: 'MOMO工具箱的界面设计、代码、功能逻辑均为原创作品，受知识产权法保护。未经授权，您不得复制、传播、修改或以商业目的使用平台内容。工具生成的结果内容归使用者所有。'
            },
            {
              title: '免责声明',
              content: '本服务按「现状」提供，不对工具的准确性、完整性、可靠性做任何明示或暗示的保证。使用本工具产生的任何结果由您自行承担风险。，我们会尽力确保数据安全，但不对因使用本服务导致的任何数据丢失或泄露承担责任。'
            },
            {
              title: '第三方服务',
              content: '平台部分功能使用第三方服务（如 Google AdSense 广告、AI 接口等），其行为和隐私政策不受我们控制。使用第三方服务即表示您同意其服务条款和隐私政策。'
            },
            {
              title: '服务变更',
              content: '我们保留随时修改服务条款的权利。修改后的条款一旦发布即生效。如您继续使用服务，则视为接受修改后的条款。建议您定期查阅以了解最新内容。'
            },
            {
              title: '联系方式',
              content: '如对本条款有任何疑问，请联系：1902243211@qq.com'
            }
          ].map((s, i) => (
            <section key={i} className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full" />
                {s.title}
              </h2>
              <p className="text-sm leading-loose text-text2 border-l-2 border-border-site pl-6">
                {s.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}