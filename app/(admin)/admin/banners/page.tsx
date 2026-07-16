'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  position: string;
  published: boolean;
}

const POSITIONS = [
  { value: 'home-hero', label: 'トップページ ヒーロー下' },
  { value: 'home-mid', label: 'トップページ 中段' },
  { value: 'sidebar', label: 'サイドバー' },
  { value: 'products-top', label: '商品一覧 上部' },
  { value: 'blog-sidebar', label: 'ブログ サイドバー' },
];

const EMPTY: Omit<Banner, 'id'> = {
  title: '',
  image: '',
  link: '',
  position: 'home-mid',
  published: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchBanners(); }, []);

  async function fetchBanners() {
    const res = await fetch('/api/admin/banners');
    if (res.ok) {
      const data = await res.json();
      setBanners(data.banners || []);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, image: data.url }));
      setMessage('画像をアップロードしました');
    }
    setUploading(false);
  }

  async function handleSave() {
    const url = editId ? `/api/admin/banners/${editId}` : '/api/admin/banners';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage(editId ? '更新しました ✓' : '追加しました ✓');
      setShowForm(false);
      setEditId(null);
      fetchBanners();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('このバナーを削除しますか？')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    setMessage('削除しました');
    fetchBanners();
  }

  function openEdit(b: Banner) {
    setEditId(b.id);
    setForm({ title: b.title, image: b.image, link: b.link, position: b.position, published: b.published });
    setShowForm(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>バナー管理</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} className={styles.addBtn} id="add-banner-btn">
          + バナーを追加
        </button>
      </div>

      {message && <div className={styles.msg}>{message}</div>}

      {banners.length === 0 ? (
        <div className={styles.empty}>
          <p>バナーがまだありません。自作バナー画像を追加してサイトに表示できます。</p>
        </div>
      ) : (
        <div className={styles.list}>
          {banners.map(b => (
            <div key={b.id} className={styles.bannerRow}>
              {b.image && (
                <div className={styles.bannerThumb}>
                  <Image src={b.image} alt={b.title} fill className={styles.thumbImg} />
                </div>
              )}
              <div className={styles.bannerInfo}>
                <div className={styles.bannerTitle}>{b.title}</div>
                <div className={styles.bannerPos}>{POSITIONS.find(p => p.value === b.position)?.label}</div>
              </div>
              <div className={styles.bannerActions}>
                <button onClick={() => openEdit(b)} className={styles.editBtn}>編集</button>
                <button onClick={() => handleDelete(b.id)} className={styles.deleteBtn}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editId ? 'バナーを編集' : 'バナーを追加'}</h2>
              <button onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.field}>
                <label className={styles.label}>タイトル</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={styles.input} placeholder="バナーのタイトル" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>配置場所</label>
                <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className={styles.select}>
                  {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>リンク先URL</label>
                <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className={styles.input} placeholder="https://..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>バナー画像</label>
                {form.image && (
                  <div className={styles.preview}>
                    <Image src={form.image} alt="preview" fill className={styles.previewImg} />
                  </div>
                )}
                <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={styles.input} placeholder="/images/banners/..." />
                <button type="button" onClick={() => fileRef.current?.click()} className={styles.uploadBtn} disabled={uploading}>
                  {uploading ? 'アップロード中...' : '画像をアップロード'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className={styles.hidden} />
              </div>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                <span>公開する</span>
              </label>
            </div>
            <div className={styles.modalFooter}>
              <button onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }} className={styles.cancelBtn}>キャンセル</button>
              <button onClick={handleSave} className={styles.saveBtn}>{editId ? '更新' : '追加'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
