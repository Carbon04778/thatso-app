import { useEffect, useState } from 'react';

const UP = 'https://thatso-germany.de/wp-content/uploads/';

const slides = [
  {
    img: UP + '2020/10/slider_thatso.jpg',
    title: 'DIE REVOLUTION DER SONNENSCHUTZFAKTOREN',
    body: 'All in one',
  },
  {
    img: UP + '2020/10/thatso1.jpg',
    title: "Bräunungssprays und Bräunungsduschen von That'so",
    body: 'Sun Makeup, Pure Body, Pure Sun\n- für eine langanhaltende natürliche Bräune und eine junge gepflegte Haut.',
  },
  {
    img: UP + '2020/10/thatso2.jpg',
    title: 'Langanhaltende Bräune für jeden Hauttyp',
    body: "That'so Sun Makeup verleiht Ihrer Haut einen natürlich braunen Teint und pflegt sie mit einer Extradosis Feuchtigkeit.",
  },
  {
    img: UP + '2020/10/thatso3.jpg',
    title: 'Absoluter Glanz und zeitlose Schönheit für Ihre Haut',
    body: "That'so Pure Body mit Anti-Aging-Effekt schmeichelt Ihrer Haut mit Peeling und Feuchtigkeit.",
  },
  {
    img: UP + '2020/10/thatso4.jpg',
    title: 'Sonnenschutz der neuen Generation',
    body: "That'so Pure Sun: pflegende, wasserfeste und fleckenlose Sprays für den perfekten Tag am Strand.",
  },
];

// Masonry columns exactly as on the live site: tall (494px) and short (208px) tiles.
const galleryColumns = [
  [
    { img: '2020/10/project-single-1-e1603117736714.jpg', label: 'SUN MAKE UP', tall: true },
    { img: '2020/10/project-single-4-e1603117847175.jpg', label: 'PURE BODY' },
  ],
  [
    { img: '2020/10/project-single-2-e1603117831493.jpg', label: 'BEAUTY ESPRESSO' },
    { img: '2020/10/project-single-5-e1603117797993.jpg', label: 'ON THE DARK EXTRA DARK', tall: true },
  ],
  [
    { img: '2020/10/project-single-3-e1603117777617.jpg', label: 'PURE SUN', tall: true },
    { img: '2020/10/project-single-6-e1603117859782.jpg', label: 'SPRAY CABIN' },
  ],
];

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className="w-[25px] h-[25px]" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === 'left' ? 'M15 4l-8 8 8 8' : 'M9 4l8 8-8 8'} />
    </svg>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSlide((s) => (s + 1) % slides.length), 10000);
    return () => clearTimeout(t);
  }, [slide]);

  return (
    <div className="text-[#6d6d6d]">
      {/* Hero slider (fade) */}
      <section className="relative h-[600px] md:h-[900px] overflow-hidden text-[#f9f9f9]">
        {slides.map((s, i) => (
          <div
            key={s.img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
            aria-hidden={i !== slide}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} />
            <div className="absolute inset-0" style={{ background: 'rgba(41,41,41,.52)' }} />
            <div className="relative h-full flex items-center justify-center px-6 md:pb-[80px]">
              <div className="max-w-[864px] text-center">
                <h1 className="text-[40px] leading-[48px] md:text-[72px] md:leading-[80px] font-thin">{s.title}</h1>
                <p className="mt-[30px] text-[16px] leading-[24px] uppercase whitespace-pre-line">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
          className="absolute left-[10px] top-1/2 -translate-y-1/2 z-10"
          aria-label="Voriger"
        >
          <Chevron dir="left" />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % slides.length)}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 z-10"
          aria-label="Nächster"
        >
          <Chevron dir="right" />
        </button>
      </section>

      {/* Product-line masonry gallery, overlapping the bottom of the hero */}
      <section className="relative z-10 max-w-[1140px] mx-auto md:-mt-[200px] grid grid-cols-1 md:grid-cols-3">
        {galleryColumns.map((col, c) => (
          <div key={c} className="flex flex-col">
            {col.map((tile) => (
              <a
                key={tile.img}
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`group relative block overflow-hidden ${tile.tall ? 'h-[494px]' : 'h-[208px]'}`}
              >
                {/* Elementor gallery hover: image grows, overlay and title fade in (0.8s) */}
                <span
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms] group-hover:scale-110"
                  style={{ backgroundImage: `url(${UP + tile.img})` }}
                />
                <span className="absolute inset-0 bg-[rgba(41,41,41,0.52)] opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms]" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-center text-[16px] text-[#f9f9f9] opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms]">
                  {tile.label}
                </span>
              </a>
            ))}
          </div>
        ))}
      </section>

      {/* Gold brand block */}
      <section className="bg-brand text-[#f9f9f9] mt-[70px] py-[70px]">
        <div className="max-w-[1120px] mx-auto px-6 md:px-0 grid md:grid-cols-[49fr_51fr] gap-10 md:gap-0">
          <div className="flex md:justify-end md:pr-[146px] pt-[10px]">
            <div className="md:w-[253px] text-center md:text-right">
              <h2 className="text-[56px] leading-[64px] font-semibold">THAT'SO</h2>
              <h3 className="mt-5 text-[24px] leading-[32px] font-light">DER NEUE TREND AUS HOLLYWOOD</h3>
              <video
                src={UP + '2023/02/VIDEO-2023-02-06-11-00-18.mp4'}
                controls
                playsInline
                preload="metadata"
                className="mt-5 w-[223px] h-[393px] object-cover bg-black mx-auto md:mr-0 md:ml-auto"
              />
            </div>
          </div>
          <div className="pt-[10px]">
            <h3 className="text-[24px] leading-[32px] font-light">
              Die Nummer 1 für Sie und Ihn bei Bräunungssprays, Cremes und Mousse.
            </h3>
            <h4 className="mt-5 text-[16px] leading-[24px]">
              Sie wollen eine natürliche Bräune ohne Gelbstich und ohne Flecken? Wir haben die Lösung!
            </h4>
            <div className="mt-5 text-[13px] leading-[24px] space-y-[14px]">
              <p>
                Lassen Sie sich jetzt in die neue Welt der That’so Produkte entführen und verwöhnen Sie Ihre Haut
                damit! That’so ist mit seinen Bräunungssystemen weltweit die Nummer 1.
              </p>
              <p>
                Die Kosmetiklinie und die Selbstbräuner von That’so sind ein innovatives, modernes
                Komplett-Beauty-Konzept. Sie können von nun an Ihre Haut zeitgleich bräunen und pflegen. Eine
                sofortige, gleichmäßige, natürliche Bräune, die tagelang anhält.
              </p>
              <p>
                Das Sun MakeUp – Pure Tanning&amp;AntiAging, sowie die anderen Kosmetikbereiche, sind die ersten
                Produkte ihrer Art, die Ihnen ein Gefühl von sonnengebräunter Haut geben. Ohne die Poren zu
                verstopfen, verleihen Ihnen die Kosmetikprodukte einen attraktiven Teint auf Ihrer Haut.
              </p>
              <p>
                Pure Tanning&amp;AntiAging, Pure Body, Pure White und Pure Sun sind ideale Produkt für die
                Eigenanwendung, um sich jederzeit selbst eine gleichmäßige, natürliche und perfekte Bräune zu
                ermöglichen oder um der Haut ein seidenweiches und straffes Gefühl zu geben.
              </p>
              <p>
                Mit einer deutlich einfacheren Handhabung als das Auftragen eines herkömmlichen MakeUp, werden Ihr
                Gesicht, Dekolleté, Nacken, Arme und Beine perfekt gebräunt. 3 lange Sonnentage.
              </p>
              <p>Es ist kein gewöhnliches MakeUp – es ist Sun MakeUp! That’so!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Centered heading */}
      <section className="max-w-[1120px] mx-auto px-6 pt-[80px] pb-[16px] text-center">
        <h2 className="text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-light">
          Bräunungssprays und Bräunungsduschen
        </h2>
        <p className="mt-4 text-[24px] leading-[32px] font-light">
          Die Nummer 1 bei Bräunungssprays und Pflegeprodukten
        </p>
      </section>

      {/* Sun Makeup: terraart.de screenshot + text */}
      <section className="max-w-[1120px] mx-auto px-6 md:px-0 pt-[30px] pb-[103px] grid md:grid-cols-[740px_1fr] gap-8 md:gap-0 items-start">
        <div className="md:px-5">
          <img
            src={UP + '2020/10/Bildschirmfoto-2020-10-19-um-13.53.43.png'}
            alt="Terra Art Website"
            className="w-full md:w-[700px] h-auto"
          />
        </div>
        <div className="md:pl-10 md:pr-5">
          <h4 className="text-[24px] leading-[32px] font-light">Sun Makeup</h4>
          <p className="mt-5 text-[13px] leading-[24px]">
            …ist ein innovatives, modernes “Komplett-Beauty-Konzept”. Sie können von nun an Ihre Haut zeitgleich
            bräunen und pflegen. Eine sofortige, gleichmäßige, schöne Bräune, die tagelang anhält. That´so Sun
            Makeup ist das erste Produkt seiner Art, das Ihnen das Gefühl von “sonnengeküsster” Haut gibt. Ohne
            Ihre Poren zu verstopfen, verleiht Sun Makeup Ihrer Haut einen natürlichen, schönen Teint.
          </p>
          <a
            href="https://www.terraart.de/"
            target="_blank"
            rel="noreferrer"
            className="mt-[35px] inline-block border border-brand px-[30px] py-[15px] text-[16px] leading-[24px] text-[#6d6d6d] hover:bg-brand hover:text-[#f9f9f9] transition-colors duration-300"
          >
            Zu Terra Art.de
          </a>
        </div>
      </section>
    </div>
  );
}
