import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const CATALOG_URL = 'https://servicio-catalogo-6zp3.onrender.com/api/libros';
const ORDERS_URL  = 'https://servicio-ordenes-6yvn.onrender.com/api/ordenes';

/* ─── Cover palettes ─── */
const PALETTES = [
  { bg: 'linear-gradient(160deg,#0a0a14 0%,#151525 100%)', color: '#00f0ff' },
  { bg: 'linear-gradient(160deg,#140510 0%,#2a0a20 100%)', color: '#ff003c' },
  { bg: 'linear-gradient(160deg,#05140a 0%,#0a2a15 100%)', color: '#39ff14' },
  { bg: 'linear-gradient(160deg,#141005 0%,#2a200a 100%)', color: '#ffaa00' },
  { bg: 'linear-gradient(160deg,#101014 0%,#1a1a25 100%)', color: '#b0b0d0' },
];

/* ─── SVG Icons ─── */
const Icon = {
  book: (sz=24) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  bag: (sz=18) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  x: (sz=20) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: (sz=22) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  alert: (sz=22) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  feather: (sz=14) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  star: (sz=10) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

/* ─── StockBadge ─── */
function StockBadge({ stock }) {
  if (stock === 0) return <span className="badge badge-none">● STOCK: 0</span>;
  return               <span className="badge badge-ok">● STOCK: {stock}</span>;
}

/* ─── SkeletonCard ─── */
function SkeletonCard() {
  return (
    <div className="book-card" style={{ height: 360 }}>
      <div className="skeleton" style={{ height: 160 }} />
      <div style={{ padding: '1.1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div className="skeleton" style={{ height: 12, width: '50%' }} />
        <div className="skeleton" style={{ height: 12, width: '35%', marginTop: 4 }} />
        <div className="skeleton" style={{ height: 38, width: '100%', marginTop: 12 }} />
      </div>
    </div>
  );
}

/* ─── BookCard ─── */
function BookCard({ book, index, onBuy }) {
  const p = PALETTES[index % PALETTES.length];
  return (
    <article className="book-card" style={{ animationDelay: `${index * 90}ms` }}>
      {/* Cover */}
      <div className="book-cover" style={{ background: p.bg }}>
        <span className="book-cover-id">#{book.id}</span>
        <h3 className="book-cover-title" style={{ color: p.color }}>{book.titulo}</h3>
      </div>

      {/* Body */}
      <div className="book-body">
        <div>
          <p className="book-author">{book.autor}</p>
          <StockBadge stock={book.stock} />
        </div>
        <div>
          <div className="ornament-line" style={{ margin: '0.6rem 0' }}>
            <span style={{ fontSize: 9 }}>{Icon.star()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '0.9rem' }}>
            <span className="price">{book.precio}<span className="price-unit">CRDT</span></span>
          </div>
          <button className="btn-buy" onClick={() => onBuy(book)}>
            {Icon.bag()} ADQUIRIR
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── OrderModal ─── */
function OrderModal({ book, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({ cantidad: 1, cliente: 'CyberPunk_404' });
  const p = PALETTES[book.id % PALETTES.length] || PALETTES[0];
  const total = (book.precio * (Number(form.cantidad) || 0)).toLocaleString('es-MX');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true">
        {/* Color strip */}
        <div style={{ height: 2, background: `linear-gradient(90deg, var(--neon-cyan), ${p.color})` }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 2, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${p.color}` }}>
              <span style={{ color: p.color, display: 'flex' }}>{Icon.book(17)}</span>
            </div>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '0.05em' }}>
              PROCESAR DESCARGA
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.7, display: 'flex', padding: 4, borderRadius: 2 }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--neon-magenta)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            {Icon.x()}
          </button>
        </div>

        {/* Book summary */}
        <div style={{ margin: '1rem 1.4rem 0', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.85rem 1rem' }}>
            <div style={{ width: 44, height: 60, borderRadius: 2, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${p.color}`, boxShadow: `0 0 10px ${p.color}40` }}>
              <span style={{ color: p.color, opacity: 0.85, display: 'flex' }}>{Icon.book(20)}</span>
            </div>
            <div>
              <p style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{book.titulo}</p>
              <p style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{book.autor}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)' }}>
            <StockBadge stock={book.stock} />
            <span className="price" style={{ fontSize: '1.25rem' }}>{book.precio}<span className="price-unit">CRDT</span></span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ padding: '1.1rem 1.4rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <input type="hidden" name="libroId" value={book.id} />

          <div>
            <label className="form-label">ID DEL USUARIO</label>
            <input type="text" required className="form-input" value={form.cliente}
              onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Ingresa tu alias" />
          </div>

          <div>
            <label className="form-label">UNIDADES A EXTRAER</label>
            <input type="number" required min="1" className="form-input" value={form.cantidad}
              onChange={e => setForm({ ...form, cantidad: e.target.value })} />
          </div>

          {/* Live total */}
          <div className="total-box">
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Fira Code', textTransform: 'uppercase' }}>COSTO TOTAL</span>
            <span style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>
              {total} <span style={{ fontFamily: 'Fira Code', fontSize: '0.7rem', fontWeight: 400, color: 'var(--neon-cyan)', opacity: 0.8 }}>CRDT</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>ABORTAR</button>
            <button type="submit" className="btn-confirm" disabled={isSubmitting}>
              {isSubmitting ? <><div className="spinner" /> PROCESANDO…</> : <>{Icon.bag(16)} EJECUTAR COMPRA</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className="toast-wrapper">
      <div className={`toast toast-${toast.type}`}>
        <span style={{ flexShrink: 0, marginTop: 1, display: 'flex' }}>
          {toast.type === 'success' ? Icon.check() : Icon.alert()}
        </span>
        <p style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{toast.message}</p>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', flexShrink: 0, color: 'inherit' }}>{Icon.x(16)}</button>
      </div>
    </div>
  );
}

/* ─── App ─── */
export default function App() {
  const [books, setBooks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast]               = useState(null);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    // Pide los IDs del 1 al 5
    const res = await Promise.all(
      [1,2,3,4,5].map(id => axios.get(`${CATALOG_URL}/${id}`).catch(() => null))
    );
    setBooks(res.filter(r => r?.data).map(r => r.data));
    setLoading(false);
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5500);
  };

  const handleOrder = async (form) => {
    if (!selectedBook) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(ORDERS_URL, {
        libroId:  selectedBook.id,
        cantidad: Number(form.cantidad),
        cliente:  form.cliente,
      });
      if (res.status === 201) {
        showToast('success', `¡TRANSACCIÓN EXITOSA! COSTO TOTAL: ${res.data.orden.totalAPagar.toLocaleString('es-MX')} CRDT`);
        setSelectedBook(null);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 400 ? (err.response.data.error || 'INVENTARIO INSUFICIENTE PARA COMPLETAR LA EXTRACCIÓN.') :
        status === 404 ? 'EL ARCHIVO NO EXISTE EN LA BASE DE DATOS.' :
        'CONEXIÓN FALLIDA CON EL SERVIDOR CENTRAL.';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'var(--bg-surface)',
        padding: '3rem 1.5rem 3.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Cyber grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
        {/* Neon glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,240,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {/* Est. badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.2rem', opacity: 0.7 }}>
            <span style={{ color: 'var(--neon-cyan)', display: 'flex' }}>{Icon.feather()}</span>
            <span style={{ color: 'var(--neon-cyan)', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'Fira Code' }}>SYS_INIT // 2025</span>
            <span style={{ color: 'var(--neon-cyan)', display: 'flex', transform: 'scaleX(-1)' }}>{Icon.feather()}</span>
          </div>

          {/* Lines + Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to right, transparent, rgba(0,240,255,0.5))' }} />
            <span style={{ color: 'var(--neon-cyan)', display: 'flex', opacity: 1, textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>{Icon.book(38)}</span>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to left, transparent, rgba(0,240,255,0.5))' }} />
          </div>

          <h1 style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            marginBottom: '0.8rem',
            textShadow: '0 0 20px rgba(0,240,255,0.3)'
          }}>
            NEXUS DATABANK
          </h1>

          <p style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
          }}>
            &gt; Accediendo a los archivos principales...
          </p>

          {/* Ornament divider */}
          <div style={{ maxWidth: 300, margin: '1.8rem auto 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(0,240,255,0.4))' }} />
            <span style={{ color: 'var(--neon-cyan)', fontSize: '0.65rem', letterSpacing: '0.4em', fontFamily: 'Fira Code', opacity: 0.8 }}>[ ROOT / CATALOG ]</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(0,240,255,0.4))' }} />
          </div>
        </div>
      </header>

      {/* ── Color band ── */}
      <div style={{ height: 2, background: 'linear-gradient(to right, var(--neon-cyan), var(--neon-magenta), var(--neon-green))', flexShrink: 0 }} />

      {/* ── MAIN ── */}
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '3.5rem 1.5rem' }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'Fira Code', fontSize: '0.72rem', color: 'var(--neon-cyan)', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
            DATOS RECUPERADOS
          </p>
          <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
            ARCHIVOS DISPONIBLES
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
          gap: '1.75rem',
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} onBuy={setSelectedBook} />
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && books.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--neon-magenta)', opacity: 0.8 }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', textShadow: '0 0 15px currentColor' }}>{Icon.alert(52)}</span>
            <p style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '1.7rem', marginBottom: '0.5rem' }}>ERROR: CONEXIÓN PERDIDA</p>
            <p style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              &gt; Asegúrate de que el Servicio de Catálogo esté en línea.
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 1rem', textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontFamily: 'Fira Code', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          SYS.v1.0.4 © 2025 NEXUS CORP · MICROSERVICES
        </p>
      </footer>

      {/* ── MODAL ── */}
      {selectedBook && (
        <OrderModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSubmit={handleOrder}
          isSubmitting={isSubmitting}
        />
      )}

      {/* ── TOAST ── */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
