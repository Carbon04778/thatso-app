import { useState } from 'react';

export default function Kontakt() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center min-h-[380px] bg-cover bg-center text-white text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,20,20,.5),rgba(20,20,20,.5)), url(https://thatso-germany.de/wp-content/uploads/2020/10/deep-kineticell-and-pink-angel-1.jpg)',
        }}
      >
        <h1 className="text-5xl md:text-7xl font-bold">Kontakt</h1>
        <p className="mt-4 uppercase tracking-widest text-sm">Emotion for your skin</p>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <img
          src="https://thatso-germany.de/wp-content/uploads/2020/10/thatso4.jpg"
          alt="That'so"
          className="w-full h-[320px] object-cover"
        />
        <div className="text-center flex flex-col justify-center">
          <p className="uppercase tracking-widest text-xs text-gray-400 mb-4">That's me... Showroom</p>
          <p className="text-lg mb-2">Wir beraten Sie in ganz Deutschland über That'so-Produkte.</p>
          <p className="text-lg mb-6">Rufen Sie an, wir beraten Sie gerne.</p>
          <hr className="w-24 mx-auto border-[#AC8542] mb-6" />
          <p className="font-semibold">Terra Art GmbH</p>
          <p>Oststr. 87, 32051 Herford</p>
          <p>+49 (0) 5221 – 69498-0</p>
          <p>team@terraart.de</p>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 pb-20 grid md:grid-cols-2 gap-10">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Vorname</label>
              <input required className="w-full border px-3 py-2" placeholder="Pflichtfeld" />
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input required className="w-full border px-3 py-2" placeholder="Pflichtfeld" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">E-Mail</label>
              <input required type="email" className="w-full border px-3 py-2" placeholder="Pflichtfeld" />
            </div>
            <div>
              <label className="block text-sm mb-1">Telefon</label>
              <input className="w-full border px-3 py-2" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Produktlinie</label>
            <select className="w-full border px-3 py-2">
              <option>– Bitte auswählen –</option>
              <option>Self Tan</option>
              <option>Sun Care</option>
              <option>Self Care</option>
              <option>Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Nachricht</label>
            <textarea required rows={6} className="w-full border px-3 py-2" placeholder="Pflichtfeld" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            <span>
              Ich habe die Datenschutzerklärung zur Kenntnis genommen. Ich stimme zu, dass meine Angaben und
              Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden.
            </span>
          </label>
          <button
            type="submit"
            className="bg-[#AC8542] text-white px-8 py-3 uppercase tracking-wide font-semibold hover:bg-[#8f6d35] transition-colors"
          >
            {sent ? 'Gesendet ✓' : 'Senden'}
          </button>
        </form>
        <div className="bg-gray-100 flex items-center justify-center text-gray-400 min-h-[300px]">
          [ Google Maps – Terra Art GmbH, Herford ]
        </div>
      </div>
    </div>
  );
}
