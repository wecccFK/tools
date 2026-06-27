import { LanguageProvider } from '../i18n/LanguageContext';
import Header from './Header';

export default function AppShell() {
  return (
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
}
