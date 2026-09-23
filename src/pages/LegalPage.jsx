import { useLocation } from 'react-router-dom';
import { getPageBySlug } from '../lib/data';
import FormattedText from '../components/FormattedText';

export default function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const page = getPageBySlug(slug);

  if (!page) {
    return <div className="max-w-[900px] mx-auto px-6 py-24">Seite nicht gefunden.</div>;
  }

  const lines = page.text.split('\n');
  const body = (lines[0]?.trim() === page.title.trim() ? lines.slice(1) : lines).join('\n');

  return (
    <div className="max-w-[900px] mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-gray-500 mb-10">{page.title}</h1>
      <FormattedText text={body} className="text-[15px] text-gray-800" />
    </div>
  );
}
