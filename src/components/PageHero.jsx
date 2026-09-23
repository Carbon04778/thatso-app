export default function PageHero({ title, image, dark = false }) {
  return (
    <div
      className="relative flex items-center min-h-[280px] bg-cover bg-center"
      style={{
        backgroundImage: image
          ? `linear-gradient(${dark ? 'rgba(20,20,20,.55)' : 'rgba(180,180,180,.65)'}, ${
              dark ? 'rgba(20,20,20,.55)' : 'rgba(180,180,180,.65)'
            }), url(${image})`
          : undefined,
        backgroundColor: image ? undefined : '#c9c9c9',
      }}
    >
      <h1
        className={`text-5xl md:text-7xl font-bold px-6 md:px-16 max-w-[1300px] mx-auto w-full ${
          dark ? 'text-white' : 'text-white'
        }`}
      >
        {title}
      </h1>
    </div>
  );
}
