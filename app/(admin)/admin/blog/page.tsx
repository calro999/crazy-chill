'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  publishedAt: string;
  published: boolean;
}

const EMPTY: Omit<Post, 'id' | 'slug'> = {
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  author: 'CRAZY CHILL',
  publishedAt: new Date().toISOString().split('T')[0],
  published: true,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch('/api/admin/blog');
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
  }

  async function handleSave() {
    if (!form.title) { setMessage('タイトルを入力してください'); return; }
    setSaving(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const url = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags }),
    });
    if (res.ok) {
      setMessage(editId ? '更新しました ✓' : '追加しました ✓');
      setShowForm(false);
      fetchPosts();
    } else {
      setMessage('エラーが発生しました');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('この記事を削除しますか？')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setMessage('削除しました');
    fetchPosts();
  }

  function openEdit(p: Post) {
    setEditId(p.id);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, tags: p.tags, author: p.author, publishedAt: p.publishedAt, published: p.published });
    setTagsInput(p.tags.join(', '));
    setShowForm(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>ブログ管理</h1>
        <button onClick={() => { setEditId(null); setForm(EMPTY); setTagsInput(''); setShowForm(true); }} className={styles.addBtn} id="add-blog-btn">
          + 新しい記事
        </button>
      </div>

      {message && <div className={styles.msg}>{message}</div>}

      <div className={styles.list}>
        {posts.length === 0 ? (
          <div className={styles.empty}>記事がまだありません。「新しい記事」から作成してください。</div>
        ) : (
          posts.map(p => (
            <div key={p.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.postTitle}>{p.title}</div>
                <div className={styles.postMeta}>
                  <span>{p.publishedAt}</span>
                  <span className={`${styles.status} ${p.published ? styles.pub : styles.draft}`}>
                    {p.published ? '公開' : '下書き'}
                  </span>
                </div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => openEdit(p)} className={styles.editBtn}>編集</button>
                <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>削除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editId ? '記事を編集' : '新しい記事'}</h2>
              <button onClick={() => setShowForm(false)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.field}>
                <label className={styles.label}>タイトル *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={styles.input} placeholder="記事タイトル" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>概要（excerpt）</label>
                <input type="text" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className={styles.input} placeholder="記事の一言説明（一覧ページに表示）" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>本文（マークダウン対応）</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className={styles.textarea} rows={12} placeholder="# 見出し&#10;&#10;本文を入力..." />
              </div>
              <div className={styles.twoCol}>
                <div className={styles.field}>
                  <label className={styles.label}>タグ（カンマ区切り）</label>
                  <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className={styles.input} placeholder="ファッション, ダークパンク" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>公開日</label>
                  <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} className={styles.input} />
                </div>
              </div>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                <span>公開する</span>
              </label>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>キャンセル</button>
              <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                {saving ? '保存中...' : editId ? '更新' : '投稿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
