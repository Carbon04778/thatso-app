import { useState } from 'react';

const UP = 'https://thatso-germany.de/wp-content/uploads/2020/10/';

const slides = [
  {
    img: UP + 'slider_thatso.jpg',
    eyebrow: 'All in one',
    title: 'Die Revolution der Sonnenschutzfaktoren',
  },
  {
    img: UP + 'thatso1.jpg',
    title: "Bräunungssprays und Bräunungsduschen von That'so",
    body: 'SUN MAKEUP, PURE BODY, PURE SUN\nFür eine langanhaltende natürliche Bräune und eine junge gepflegte Haut.',
  },
  {
    img: UP + 'thatso2.jpg',
    title: 'Langanhaltende Bräune für jeden Hauttyp',
    body: "That'so Sun Makeup verleiht Ihrer Haut einen natürlich braunen Teint und pflegt sie mit einer Extradosis Feuchtigkeit.",
  },
  {
    img: UP + 'thatso3.jpg',
    title: 'Absoluter Glanz und zeitlose Schönheit für Ihre Haut',
    body: "That'so Pure Body mit Anti-Aging-Effekt schmeichelt Ihrer Haut mit Peeling und Feuchtigkeit.",
  },
  {
    img: UP + 'thatso4.jpg',
    title: 'Sonnenschutz der neuen Generation',
    body: "That'so Pure Sun: pflegende, wasserfeste und fleckenlose Sprays für den perfekten Tag am Strand.",
  },
];

const gallery = [
  { img: UP + 'project-single-1-e1603117736714.jpg', label: 'Sun Make Up' },
  { img: UP + 'project-single-2-e1603117831493.jpg', label: 'Beauty Espresso' },
  { img: UP + 'project-single-3-e1603117777617.jpg', label: 'Pure Sun' },
  { img: UP + 'project-single-5-e1603117797993.jpg', label: 'On The Dark Extra Dark' },
  { img: UP + 'project-single-4-e1603117847175.jpg', label: 'Pure Body' },
  { img: UP + 'project-single-6-e1603117859782.jpg', label: 'Spray Cabin' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);

  return (
    <div>
      {/* Hero carousel */}
      <section
        className="relative min-h-[560px] flex items-center bg-cover bg-center text-white transition-all duration-500"
        style={{
          backgroundImage: `linear-gradient(rgba(10,10,10,.35),rgba(10,10,10,.35)), url(${slides[slide].img})`,
        }}
      >
        <button
          onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl opacity-80 hover:opacity-100"
          aria-label="Vorheriger"
        >
          ‹
        </button>
        <div className="max-w-[1000px] mx-auto px-6 py-24 text-center w-full">
          {slides[slide].eyebrow && (
            <p className="uppercase tracking-widest text-sm text-brand mb-4">{slides[slide].eyebrow}</p>
          )}
          <h1 className="text-4xl md:text-6xl font-bold uppercase leading-tight">{slides[slide].title}</h1>
          {slides[slide].body && (
            <p className="mt-6 text-sm uppercase tracking-wide max-w-[600px] mx-auto whitespace-pre-line">
              {slides[slide].body}
            </p>
          )}
        </div>
        <button
          onClick={() => setSlide((s) => (s + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl opacity-80 hover:opacity-100"
          aria-label="Nächster"
        >
          ›
        </button>
      </section>

      {/* Product-line masonry gallery */}
      <section className="columns-2 md:columns-3 gap-0 px-0">
        {gallery.map((tile, i) => (
          <div
            key={tile.img}
            className="relative block group overflow-hidden break-inside-avoid"
            style={{ marginBottom: 0 }}
          >
            <img
              src={tile.img}
              alt={tile.label}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ height: i % 3 === 1 ? 320 : 420 }}
            />
            <div className="absolute inset-0 bg-black/15 flex items-end p-6">
              <span className="text-white uppercase font-semibold tracking-wide text-sm">{tile.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Brand block */}
      <section className="bg-brand text-white">
        <div className="max-w-[1300px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-2">THAT'SO</h2>
            <p className="text-xl uppercase tracking-wide">Der neue Trend aus Hollywood</p>
          </div>
          <div className="space-y-4">
            <p className="text-lg font-medium">
              Die Nummer 1 für Sie und Ihn bei Bräunungssprays, Cremes und Mousse.
            </p>
            <p>Sie wollen eine natürliche Bräune ohne Gelbstich und ohne Flecken? Wir haben die Lösung!</p>
            <p>
              Lassen Sie sich jetzt in die neue Welt der That'so Produkte entführen und verwöhnen Sie Ihre
              Haut damit! That'so ist mit seinen Bräunungssystemen weltweit die Nummer 1.
            </p>
            <p>
              Die Kosmetiklinie und die Selbstbräuner von That'so sind ein innovatives, modernes
              Komplett-Beauty-Konzept. Sie können von nun an Ihre Haut zeitgleich bräunen und pflegen. Eine
              sofortige, gleichmäßige, natürliche Bräune, die tagelang anhält.
            </p>
            <p>Es ist kein gewöhnliches MakeUp – es ist Sun MakeUp! That'so!</p>
          </div>
        </div>
      </section>

      {/* Sun Makeup section */}
      <section className="max-w-[1300px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-semibold text-gray-600 mb-3">
            Bräunungssprays und Bräunungsduschen
          </h2>
          <p className="text-lg mb-6">Die Nummer 1 bei Bräunungssprays und Pflegeprodukten</p>
          <h3 className="text-2xl font-semibold mb-3">Sun Makeup</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            …ist ein innovatives, modernes "Komplett-Beauty-Konzept". Sie können von nun an Ihre Haut
            zeitgleich bräunen und pflegen. Eine sofortige, gleichmäßige, schöne Bräune, die tagelang anhält.
            That´so Sun Makeup ist das erste Produkt seiner Art, das Ihnen das Gefühl von
            "sonnengeküsster" Haut gibt. Ohne Ihre Poren zu verstopfen, verleiht Sun Makeup Ihrer Haut
            einen natürlichen, schönen Teint.
          </p>
          <a
            href="https://www.terraart.de"
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-brand text-brand px-8 py-3 uppercase tracking-wide hover:bg-brand hover:text-white transition-colors"
          >
            Zu Terra Art.de
          </a>
        </div>
        <img src={UP + 'thatso3.jpg'} alt="Sun Makeup" className="w-full h-[420px] object-cover" />
      </section>
    </div>
  );
}
