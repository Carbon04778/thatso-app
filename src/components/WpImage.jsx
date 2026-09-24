import wpImages from '../data/wpImages.json';

// <img> with the exact responsive attributes WordPress outputs on the live site
// (srcset/sizes/width/height), looked up by the image URL.
export default function WpImage({ src, alt = '', className = '', ...rest }) {
  const a = wpImages[src] || {};
  return (
    <img
      src={src}
      srcSet={a.srcSet}
      sizes={a.sizes}
      width={a.width}
      height={a.height}
      alt={alt}
      className={className}
      {...rest}
    />
  );
}
