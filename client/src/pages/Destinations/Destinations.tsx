import { useEffect, useState } from 'react';
import { ArrowRight, Bus, Clock, MapPin, Plane, Search, TrainFront } from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import styles from './destinations.module.scss';

type Transport = 'plane' | 'train' | 'bus';
type Destination = {
  id: string; transport: Transport; from: string; to: string;
  departure: string; arrival: string; duration: string;
  price: number; currency: string; description: string;
};
const modes = [
  { value: 'all', label: 'All routes', icon: MapPin },
  { value: 'plane', label: 'Flights', icon: Plane },
  { value: 'train', label: 'Trains', icon: TrainFront },
  { value: 'bus', label: 'Buses', icon: Bus },
] as const;
const icons = { plane: Plane, train: TrainFront, bus: Bus };
const labels = { plane: 'Flight', train: 'Train', bus: 'Bus' };

export default function Destinations() {
  const [routes, setRoutes] = useState<Destination[]>([]);
  const [mode, setMode] = useState<Transport | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/destinations`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load routes. Please try again.');
        const data = await response.json();
        if (!Array.isArray(data.destinations)) throw new Error('The routes service returned an unexpected response.');
        setRoutes(data.destinations);
        setDemo(data.demo === true);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Unable to load routes.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const filtered = routes.filter(route => (mode === 'all' || route.transport === mode)
    && `${route.from} ${route.to}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <SiteHeader />
        <section className={styles.intro}>
          <p className={styles.eyebrow}>THE JOURNEY STARTS HERE</p>
          <h1>Find your next<br /><span>somewhere.</span></h1>
          <p>By air, by rail or by road. Explore the routes that bring<br className={styles.desktopBreak} /> you closer to your next adventure.</p>
          <a href="#routes" className={styles.explore}>Explore destinations <ArrowRight size={18} /></a>
        </section>
      </div>
      <main className={styles.content} id="routes">
        <div className={styles.filters}>
          <div className={styles.modes} aria-label="Transport type">
            {modes.map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)}>
                <Icon size={19} />{label}
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Search size={19} /><span className={styles.srOnly}>Search by departure or destination city</span>
            <input type="search" placeholder="Where would you like to go?" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
        </div>
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>A WORLD OF POSSIBILITIES</p><h2>Routes worth exploring</h2></div>
          <span aria-live="polite">{loading ? 'Loading routes…' : `${filtered.length} routes`}</span>
        </div>
        {demo && <p className={styles.notice}>Demo catalogue · Times and prices are illustrative, not live schedules or bookable fares. All times are local.</p>}
        {loading ? <p className={styles.state} role="status">Finding your next adventure…</p>
          : error ? <div className={styles.state} role="alert"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Try again</button></div>
          : filtered.length === 0 ? <div className={styles.state}><h3>No routes found</h3><p>Try another city or transport type.</p><button onClick={() => { setQuery(''); setMode('all'); }}>Reset filters</button></div>
          : <div className={styles.grid}>{filtered.map(route => {
            const Icon = icons[route.transport];
            return <article className={styles.card} key={route.id}>
              <div className={`${styles.cardTop} ${styles[route.transport]}`}><Icon size={44} strokeWidth={1.2} /><span>{labels[route.transport]}</span><h3>{route.to}</h3></div>
              <div className={styles.cardBody}>
                <div className={styles.route}><strong>{route.from}</strong><ArrowRight size={17} /><strong>{route.to}</strong></div>
                <p className={styles.description}>{route.description}</p>
                <div className={styles.schedule}><span>{route.departure} — {route.arrival}</span><span><Clock size={15} />{route.duration}</span></div>
                <div className={styles.price}><span>{demo ? 'Example one-way fare' : 'One-way fare'}</span><strong>{new Intl.NumberFormat('en', { style: 'currency', currency: route.currency, maximumFractionDigits: 0 }).format(route.price)}</strong></div>
              </div>
            </article>;
          })}</div>}
        <section className={styles.how} id="how-it-works"><h2>A little planning. A world to discover.</h2><div><p><b>01 · Choose your way</b>Compare flights, trains and buses.</p><p><b>02 · Find your destination</b>Search by departure or arrival city.</p><p><b>03 · Get inspired</b>Explore sample journeys for your next trip.</p></div></section>
      </main>
      <footer className={styles.footer}>✦ TripGenius <span>Every great trip starts with a little curiosity.</span></footer>
    </div>
  );
}
