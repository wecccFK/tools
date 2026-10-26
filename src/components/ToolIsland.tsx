import { LanguageProvider } from '../i18n/LanguageContext';
import ToolRenderer from './ToolRenderer';
import type { Language } from '../i18n/translations';

export default function ToolIsland({ toolId, initialLang }: { toolId: string; initialLang?: Language }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <ToolRenderer toolId={toolId} />
    </LanguageProvider>
  );
}
