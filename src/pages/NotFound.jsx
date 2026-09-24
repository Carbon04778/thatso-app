import { useEffect } from 'react';
import WpPage from '../components/WpPage';

// WordPress / Hello theme 404 page, as on the live site.
const HTML =
  '<main id="content" class="site-main" role="main"> <header class="page-header"> <h1 class="entry-title">Diese Seite konnte nicht gefunden werden.</h1> </header> <div class="page-content"> <p>An diesem Ort konnte nichts gefunden werden.</p> </div> </main>';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Seite wurde nicht gefunden. - TerraArt - Thats-so';
  }, []);
  return <WpPage html={HTML} bodyClass="error404" />;
}
