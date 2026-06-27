import { LanguageProvider } from '../i18n/LanguageContext';
import HomeContentInner from './HomeContentInner';

// 包一层 Provider，让 HomeContent 能访问语言上下文
// 注意：Astro Island 各自独立，不同 Island 间 React Context 不共享
// 这里通过 localStorage + 自定义事件同步语言状态
export default function HomeContent() {
  return (
    <LanguageProvider>
      <HomeContentInner />
    </LanguageProvider>
  );
}
