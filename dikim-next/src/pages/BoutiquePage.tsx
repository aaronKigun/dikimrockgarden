import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import '@/styles/mall.css';

interface BoutiqueItem {
  id: number;
  title: string;
  image_path: string;
}

const FALLBACK_ITEMS: BoutiqueItem[] = [
  'b01.jpg', 'b1.jpg', 'b2.jpg', 'b03.jpg',
  'b3.jpg', 'b4.jpg', 'b5.jpg', 'b6.jpg',
  'b7.jpg', 'b8.jpg', 'b9.jpg',
].map((file, idx) => ({
  id: idx + 1,
  title: `Boutique item ${idx + 1}`,
  image_path: `/images/${file}`,
}));

export default function BoutiquePage() {
  const [items, setItems] = useState<BoutiqueItem[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoutique() {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (!supabaseUrl || supabaseUrl.includes('your-project-id') || supabaseUrl.includes('placeholder')) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('boutique_items')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.warn('Boutique unavailable from Supabase; using fallbacks.', error.message);
        } else if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Boutique fetch failed; using static fallbacks.', err);
      } finally {
        setLoading(false);
      }
    }

    loadBoutique();
  }, []);

  return (
    <section className="picture-grid" data-reveal="fade">
      <div className="section-eyebrow">Shop</div>
      <h1 className="heading">Boutique</h1>
      <p className="token">
        A handpicked selection of stylish clothes, accessories, and unique finds — perfect for gifts or treating yourself.
      </p>

      <div className="grid-container">
        {loading && items.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)' }}>Loading boutique…</p>
        ) : (
          items.map((item) => (
            <div className="grid-item" key={item.id}>
              <img src={item.image_path} alt={item.title} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
