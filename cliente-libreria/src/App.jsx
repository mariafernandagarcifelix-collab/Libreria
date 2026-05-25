import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const CATALOG_URL = 'https://servicio-catalogo-6zp3.onrender.com/api/libros';
const ORDERS_URL  = 'https://servicio-ordenes-6yvn.onrender.com/api/ordenes';

/* ─── Cover palettes ─── */
const PALETTES = [
  { bg: 'linear-gradient(160deg,#7b3f2d 0%,#a05a3c 100%)', color: '#fdf6ee' },
  { bg: 'linear-gradient(160deg,#1e4a38 0%,#3a7a5a 100%)', color: '#edfaf4' },
  { bg: 'linear-gradient(160deg,#2e2460 0%,#5244a0 100%)', color: '#f4f0ff' },
  { bg: 'linear-gradient(160deg,#6a4a12 0%,#b08020 100%)', color: '#fff9e6' },
  { bg: 'linear-gradient(160deg,#0e3050 0%,#1e5878 100%)', color: '#e8f4ff' },
];

/* ─── SVG Icons (no lucide dependency issues) ─── */
const Icon = {
  book: (sz=24) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  bag: (sz=18) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  x: (sz=20) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: (sz=22) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  alert: (sz=22) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  feather: (sz=14) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
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
        <span className="book-cover-id" style={{ color: p.color }}>#{book.id}</span>
        <div className="book-cover-pages">
          {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="book-cover-shine" />
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
            <span style={{ color: 'var(--caramel)', fontSize: 9 }}>{Icon.star()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '0.9rem' }}>
            <span className="price">${book.precio}<span className="price-unit">MXN</span></span>
          </div>
          <button className="btn-buy" onClick={() => onBuy(book)}>
            {Icon.bag()} Comprar
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── OrderModal ─── */
function OrderModal({ book, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({ cantidad: 1, cliente: 'Fernanda' });
  const p = PALETTES[book.id % PALETTES.length];
  const total = (book.precio * (Number(form.cantidad) || 0)).toLocaleString('es-MX');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true">
        {/* Color strip */}
        <div style={{ height: 5, background: p.bg }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: '1px solid var(--sepia)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: p.color, display: 'flex' }}>{Icon.book(17)}</span>
            </div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.55rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
              Confirmar Pedido
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--caramel)', opacity: 0.7, display: 'flex', padding: 4, borderRadius: 4 }}
            onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7}>
            {Icon.x()}
          </button>
        </div>

        {/* Book summary */}
        <div style={{ margin: '1rem 1.4rem 0', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--sepia)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.85rem 1rem', background: p.bg + '22' }}>
            <div style={{ width: 44, height: 60, borderRadius: 3, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 8px rgba(0,0,0,0.25)' }}>
              <span style={{ color: p.color, opacity: 0.85, display: 'flex' }}>{Icon.book(20)}</span>
            </div>
            <div>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{book.titulo}</p>
              <p style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--caramel)', marginTop: 2 }}>{book.autor}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: 'var(--cream)', borderTop: '1px solid var(--sepia)' }}>
            <StockBadge stock={book.stock} />
            <span className="price" style={{ fontSize: '1.25rem' }}>${book.precio}<span className="price-unit">MXN</span></span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ padding: '1.1rem 1.4rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <input type="hidden" name="libroId" value={book.id} />

          <div>
            <label className="form-label">Nombre del lector</label>
            <input type="text" required className="form-input" value={form.cliente}
              onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Tu nombre completo" />
          </div>

          <div>
            <label className="form-label">Cantidad de ejemplares</label>
            <input type="number" required min="1" className="form-input" value={form.cantidad}
              onChange={e => setForm({ ...form, cantidad: e.target.value })} />
          </div>

          {/* Live total */}
          <div className="total-box">
            <span style={{ fontSize: '0.82rem', color: 'var(--caramel)', fontWeight: 500 }}>Total estimado</span>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--leather)' }}>
              ${total} <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 400, color: 'var(--caramel)', opacity: 0.8 }}>MXN</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-confirm" disabled={isSubmitting}>
              {isSubmitting ? <><div className="spinner" /> Procesando…</> : <>{Icon.bag(16)} Confirmar compra</>}
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
        <p style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>{toast.message}</p>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', flexShrink: 0 }}>{Icon.x(16)}</button>
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
    // Pide todos los IDs del 1 al 9 y descarta los que no existan
    const res = await Promise.all(
      [1,2,3,4,5,6,7,8,9].map(id => axios.get(`${CATALOG_URL}/${id}`).catch(() => null))
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
        showToast('success', `¡Orden creada! Total a pagar: $${res.data.orden.totalAPagar.toLocaleString('es-MX')} MXN`);
        setSelectedBook(null);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 400 ? (err.response.data.error || 'Stock insuficiente para tu pedido.') :
        status === 404 ? 'El libro no existe en el catálogo.' :
        'No se pudo conectar con el servidor. Intenta de nuevo.';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'linear-gradient(to bottom, #1a0d06, #2c1a0e)',
        padding: '3rem 1.5rem 3.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Horizontal lines texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 26px)',
          pointerEvents: 'none',
        }} />
        {/* Warm glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(158,104,64,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {/* Est. badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.2rem', opacity: 0.5 }}>
            <span style={{ color: '#c4a882', display: 'flex' }}>{Icon.feather()}</span>
            <span style={{ color: '#c4a882', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'Inter' }}>Est. 2025</span>
            <span style={{ color: '#c4a882', display: 'flex', transform: 'scaleX(-1)' }}>{Icon.feather()}</span>
          </div>

          {/* Lines + Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,168,130,0.5))' }} />
            <span style={{ color: '#d6c0a0', display: 'flex', opacity: 0.8 }}>{Icon.book(38)}</span>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to left, transparent, rgba(196,168,130,0.5))' }} />
          </div>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            fontWeight: 700,
            color: '#fdf8f0',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}>
            La Antigua Librería
          </h1>

          <p style={{
            fontFamily: '"EB Garamond", serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#c4a882',
            opacity: 0.85,
          }}>
            "Un libro es un sueño que tienes en tus manos."
          </p>

          {/* Ornament divider */}
          <div style={{ maxWidth: 260, margin: '1.6rem auto 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,168,130,0.4))' }} />
            <span style={{ color: '#c4a882', fontSize: '0.7rem', letterSpacing: '0.35em', fontFamily: 'Inter', opacity: 0.6 }}>✦ CATÁLOGO SELECTO ✦</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(196,168,130,0.4))' }} />
          </div>
        </div>
      </header>

      {/* ── Color band ── */}
      <div style={{ height: 5, background: 'linear-gradient(to right, #5c3820, #c4973a, #5c3820)', flexShrink: 0 }} />

      {/* ── MAIN ── */}
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '3.5rem 1.5rem' }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--caramel)', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
            Nuestras recomendaciones
          </p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', fontWeight: 600, color: 'var(--ink)' }}>
            Libros Destacados
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
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--caramel)', opacity: 0.6 }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>{Icon.book(52)}</span>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.7rem', marginBottom: '0.5rem' }}>Los estantes están vacíos</p>
            <p style={{ fontFamily: 'Inter', fontSize: '0.85rem' }}>
              Asegúrate de que el Servicio de Catálogo esté corriendo en el puerto 3001.
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1a0d06', padding: '1.5rem 1rem', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ width: 160, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,168,130,0.35), transparent)', margin: '0 auto 0.9rem' }} />
        <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(196,168,130,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          © 2025 La Antigua Librería · Microservicios con Node.js
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
