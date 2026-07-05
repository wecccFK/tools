import { LanguageProvider } from '../i18n/LanguageContext';
import Header from './Header';
import type { Language } from '../i18n/translations';

export default function AppShell({ initialLang }: { initialLang?: Language }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <Header />
    </LanguageProvider>
  );
}
