import { useEffect, useState } from 'react';

// Elementor page-title banner: background slideshow (fade 500ms, 5s per slide),
// #292929 overlay at 30%, thin 72px title with a soft text shadow.
export default function PageHero({ title, images = [], tall = false, position = 'center center' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % images.length), 5000);
    return () => clearTimeout(t);
  }, [index, images.length]);

  return (
    <section className={`relative overflow-hidden bg-[#c9c9c9] ${tall ? 'py-[200px]' : 'py-[100px]'}`}>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover transition-opacity duration-500"
          style={{ backgroundImage: `url(${src})`, backgroundPosition: position, opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-[#292929] opacity-30" />
      <div className="relative px-[10px] py-[10px]">
        <h1
          className="text-center text-[72px] leading-[80px] font-thin text-[#f9f9f9]"
          style={{ textShadow: 'rgba(0, 0, 0, 0.3) 10px 0px 10px' }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
