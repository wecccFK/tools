import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS } from '@/constants';
import { AppShell } from '@/components/AppShell';
import { ToolRenderer } from '@/components/ToolRendererWrapper';

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = TOOLS.find((t) => t.id === id);
  
  if (!tool) return { title: '工具未找到 | MOMO工具箱' };

  return {
    title: `${tool.seoTitle?.zh || tool.name.zh} | MOMO工具箱`,
    description: tool.seoDescription?.zh || tool.description.zh,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) notFound();

  return (
    <AppShell showBackButton backHref="/" title={tool.name.zh}>
      <ToolRenderer toolId={id} />
    </AppShell>
  );
}
