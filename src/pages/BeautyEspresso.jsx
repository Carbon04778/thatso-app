import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import WpImage from '../components/WpImage';

const UP = 'https://thatso-germany.de/wp-content/uploads/';

const sideLinks = [
  { label: 'Beauty Espresso', to: '/beauty-espresso' },
  { label: 'Self Tan', to: '/self-tan' },
  { label: 'Sun Care', to: '/sun-care' },
  { label: 'Self Care', to: '/self-care' },
  { label: 'Professional', to: '/professional' },
];

const treatments = [
  {
    title: 'Espresso intensiver Bräunungseffekt',
    items: [
      'Bräunungsspray auftragen in nur wenigen Sekunden',
      'Natürliche Farbe, die bis 5 Tage anhält',
      'Skin- Care und Anti-Aging-Wirkung',
      'Keine Flecken auf der Haut',
      'Sanfter und natürlicher Duft',
    ],
  },
  {
    title: 'Latte Intensiver Aufhellungseffekt',
    items: [
      'Aufhellungsspray anbringen in nur wenigen Sekunden',
      'Augenblickliche Wirkung: Aufhellend, Lifting und ebenmäßige Haut',
      'Langzeitwirkung: gleichmäßig und Anti Fleck',
      'Enthält Wirkstoffe, die die Bildung von Hautunreinheiten verhindern',
      'Klärende und schützende Wirkung vor Schadstoffen',
      'Sonnenschutz',
      'Anti-Oxidantionsmittel',
    ],
  },
  {
    title: 'Cappuccino gleichmäßige Bräune-Wirkung',
    items: [
      '1. Step: Behandlung „Latte“. Um der Haut Helligkeit und Ebenmäßigkeit mit Primer-Effekt zu verleihen',
      '2. Step: Behandlung „Espresso“. Um eine „soft natürliche“ und homogene Bräune zu bewirken',
    ],
  },
];

// Heading with a thin grey rule underneath (Elementor heading widget with bottom border).
export function RuledHeading({ as: Tag = 'h5', children }) {
  return (
    <div className="pb-[5px] border-b border-[#6d6d6d]">
      <Tag className="text-[16px] leading-[24px] text-[#6d6d6d]">{children}</Tag>
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 448 512" className="w-[12px] h-[13px]" fill="currentColor" aria-hidden="true">
      <path d="M313.6 304c-28.7 0-42.5 16-89.6 16s-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 384 512" className="w-[10px] h-[13px]" fill="currentColor" aria-hidden="true">
      <path d="M336 0H48C21.5 0 0 21.5 0 48v464l192-112 192 112V48c0-26.5-21.5-48-48-48zm0 428.4l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.3 0 6 2.7 6 6V428.4z" />
    </svg>
  );
}

export default function BeautyEspresso() {
  return (
    <div className="text-[#6d6d6d]">
      <PageHero title="BEAUTY ESPRESSO" images={[UP + '2020/10/project-single-2.jpg']} position="top left" tall />

      <section className="max-w-[1140px] mx-auto my-[70px] flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-[22.807%] shrink-0 p-[15px] space-y-5">
          <RuledHeading>THAT&apos;SO</RuledHeading>
          <ul className="!mb-10">
            {sideLinks.map((l, i) => (
              <li key={l.to} className={`flex ${i > 0 ? 'mt-[5px]' : ''} ${i < sideLinks.length - 1 ? 'pb-[5px]' : ''}`}>
                <Link to={l.to} className="text-[16px] leading-[24px] text-brand hover:text-[#6d6d6d] transition-colors">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
          <WpImage src={UP + '2020/10/sponsor2.jpg'} alt="That'so Sun Makeup" className="max-w-full h-auto mx-auto" />
          <a href="#" className="block !mb-10">
            <WpImage src={UP + '2020/10/sponsor1.jpg'} alt="That'so" className="max-w-full h-auto mx-auto" />
          </a>
          <RuledHeading as="h4">DIE NUMMER 1 BEI SUN MAKEUP</RuledHeading>
          <h5 className="text-[16px] leading-[24px]">
            That&apos;so sun makeup ist ein innovatives, modernes «Komplett-Beauty-Konzept».
          </h5>
        </aside>

        {/* Main column */}
        <div className="md:w-[77.193%] min-w-0 p-[15px] space-y-5">
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/WdvoBZQE_Tw?controls=0&rel=0&playsinline=0&modestbranding=0&autoplay=1"
              title="BEAUTY ESPRESSO - SPOT"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <ul className="flex flex-wrap gap-x-4 text-[13px] leading-[24px]">
            <li className="flex items-center">
              <span className="w-[16px] flex"><UserIcon /></span><span className="elementor-icon-list-text pl-[5px]">That&apos;so</span>
            </li>
            <li className="flex items-center">
              <span className="w-[16px] flex"><BookmarkIcon /></span><span className="elementor-icon-list-text pl-[5px]">BEAUTY ESPRESSO - SPOT</span>
            </li>
          </ul>
          <div className="py-[2px]">
            <hr className="border-0 border-t border-[#6d6d6d]" />
          </div>
          <h5 className="text-[13px] leading-[24px]">
            That’so Beauty Espresso ist die professionelle Behandlung, die das Konzept von Tan &amp; Beauty
            revolutioniert. Dank der Verwendung von innovativen und einmaligen Lotionen können Sie Ihre gewünschte
            Hautton wählen.
          </h5>
          <h3 className="text-[24px] leading-[32px] font-light">Bist du Espresso, Latte oder Cappuccino?</h3>
          <WpImage src={UP + '2020/10/beauty_espresso.jpg'} alt="Beauty Espresso: Milk, Espresso, Cappuccino" className="max-w-full h-auto" />
          {treatments.map((t) => (
            <div key={t.title} className="space-y-5">
              <h4 className="text-[16px] leading-[24px]">{t.title}</h4>
              <ul className="list-disc pl-10 text-[13px] leading-[24px]">
                {t.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
