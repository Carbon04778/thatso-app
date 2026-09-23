export default function FormattedText({ text, className = '' }) {
  if (!text) return null;
  const lines = text.split('\n').filter(Boolean);

  // Group consecutive bullet lines into <ul><li> blocks; everything else is a paragraph.
  const blocks = [];
  let bulletBuf = [];
  const flushBullets = () => {
    if (bulletBuf.length) {
      blocks.push({ type: 'ul', items: bulletBuf });
      bulletBuf = [];
    }
  };
  for (const line of lines) {
    if (line.startsWith('•')) {
      bulletBuf.push(line.replace(/^•\s*/, ''));
    } else {
      flushBullets();
      blocks.push({ type: 'p', text: line });
    }
  }
  flushBullets();

  return (
    <div className={className}>
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="list-disc pl-5 mb-4 space-y-1">
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i} className="mb-4 leading-relaxed">
            {b.text}
          </p>
        )
      )}
    </div>
  );
}
