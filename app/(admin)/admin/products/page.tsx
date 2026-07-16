'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  nameJa: string;
  category: string;
  series?: string;
  tags: string[];
  price: number;
  currency: string;
  image: string;
  suzuriUrl: string;
  description: string;
  descriptionEn: string;
  featured: boolean;
  isNew: boolean;
  published: boolean;
  createdAt: string;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 't-shirts', label: 'Tシャツ' },
  { value: 'hoodies', label: 'パーカー' },
  { value: 'caps', label: 'キャップ' },
  { value: 'stickers', label: 'ステッカー' },
  { value: 'glasses', label: 'グラス' },
  { value: 'accessories', label: 'アクセサリー' },
  { value: 'misc', label: '雑貨・小物' },
];

const EMPTY_PRODUCT: Omit<Product, 'id' | 'createdAt' | 'sortOrder'> = {
  name: '',
  nameJa: '',
  category: 't-shirts',
  series: '',
  tags: [],
  price: 3850,
  currency: 'JPY',
  image: '',
  suzuriUrl: 'https://suzuri.jp/CRAZYCHILL',
  description: '',
  descriptionEn: '',
  featured: false,
  isNew: false,
  published: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_PRODUCT>(EMPTY_PRODUCT);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [insights, setInsights] = useState<Record<string, number>>({});
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
      const insRes = await fetch('/api/admin/insights');
      if (insRes.ok) {
        const insData = await insRes.json();
        setInsights(insData.clicks || {});
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openNew() {
    setIsNew(true);
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setTagsInput('');
  }

  function openEdit(product: Product) {
    setIsNew(false);
    setEditingProduct(product);
    setForm({
      name: product.name,
      nameJa: product.nameJa || '',
      category: product.category,
      series: product.series || '',
      tags: product.tags || [],
      price: product.price,
      currency: product.currency,
      image: product.image,
      suzuriUrl: product.suzuriUrl,
      description: product.description,
      descriptionEn: product.descriptionEn || '',
      featured: product.featured || false,
      isNew: product.isNew || false,
      published: product.published,
    });
    setTagsInput((product.tags || []).join(', '));
  }

  function closeForm() {
    setEditingProduct(null);
    setIsNew(false);
  }

  async function handleTranslate() {
    if (!form.description && !form.nameJa) {
      setMessage('翻訳するテキストがありません');
      return;
    }
    setSaving(true);
    try {
      let newName = form.name;
      let newDescEn = form.descriptionEn;

      if (form.nameJa && !form.name) {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          body: JSON.stringify({ text: form.nameJa })
        });
        if (res.ok) {
          const { translatedText } = await res.json();
          newName = translatedText;
        }
      }

      if (form.description && !form.descriptionEn) {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          body: JSON.stringify({ text: form.description })
        });
        if (res.ok) {
          const { translatedText } = await res.json();
          newDescEn = translatedText;
        }
      }

      setForm(f => ({ ...f, name: newName, descriptionEn: newDescEn }));
      setMessage('自動翻訳が完了しました（内容を確認してください）');
    } catch (e) {
      setMessage('翻訳に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, image: data.url }));
        setMessage('画像をアップロードしました');
      } else {
        setMessage('画像アップロードに失敗しました');
      }
    } catch {
      setMessage('エラーが発生しました');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name) {
      setMessage('商品名を入力してください');
      return;
    }
    setSaving(true);
    setMessage('');

    const manualTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // 説明文から#タグを自動抽出（日本語・英数字）
    const parsedTags = form.description.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5]+/g)?.map(t => t.replace('#', '')) || [];
    
    // 重複を削除して結合
    const tags = Array.from(new Set([...manualTags, ...parsedTags]));

    const payload = { ...form, tags };

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct?.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage(isNew ? '商品を追加しました ✓' : '商品を更新しました ✓');
        await loadProducts();
        closeForm();
      } else {
        const err = await res.json();
        setMessage(err.error || '保存に失敗しました');
      }
    } catch {
      setMessage('エラーが発生しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('この商品を削除しますか？')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('商品を削除しました');
      await loadProducts();
    }
  }

  const formOpen = isNew || editingProduct !== null;

  const groupedProducts = products.reduce((acc, product) => {
    const s = product.series || 'その他 (Series Unassigned)';
    if (!acc[s]) acc[s] = [];
    acc[s].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  function toggleSeries(seriesName: string) {
    setExpandedSeries(prev => ({ ...prev, [seriesName]: !prev[seriesName] }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>商品管理</h1>
        <button onClick={openNew} className={styles.addBtn} id="add-product-btn">
          + 新しい商品を追加
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✓') ? styles.success : styles.errorMsg}`}>
          {message}
        </div>
      )}

      {/* Product list */}
      <div className={styles.productList}>
        {products.length === 0 ? (
          <div className={styles.emptyList}>
            <p>商品がまだありません。「新しい商品を追加」から登録してください。</p>
          </div>
        ) : (
          Object.entries(groupedProducts).map(([seriesName, seriesProducts]) => (
            <div key={seriesName} className={styles.seriesGroup}>
              <button 
                className={styles.seriesHeader} 
                onClick={() => toggleSeries(seriesName)}
              >
                <h2 className={styles.seriesTitle}>{seriesName} <span className={styles.seriesCount}>({seriesProducts.length})</span></h2>
                <span className={styles.seriesIcon}>{expandedSeries[seriesName] ? '▼' : '▶'}</span>
              </button>
              
              {expandedSeries[seriesName] && (
                <div className={styles.seriesContent}>
                  {seriesProducts.map(product => (
                    <div key={product.id} className={styles.productRow}>
                      <div className={styles.productImage}>
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className={styles.rowImage} />
                        ) : (
                          <div className={styles.noImg}>✦</div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.rowName}>{product.nameJa || product.name}</div>
                        <div className={styles.rowMeta}>
                          <span className={styles.rowCategory}>{product.category}</span>
                          <span className={styles.rowPrice}>¥{product.price.toLocaleString()}</span>
                          <span className={styles.rowInsights}>
                            SUZURI遷移: {insights[product.id] || 0}回
                          </span>
                          <span className={`${styles.rowStatus} ${product.published ? styles.published : styles.draft}`}>
                            {product.published ? '公開中' : '下書き'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.productActions}>
                        <button
                          onClick={() => openEdit(product)}
                          className={styles.editBtn}
                          id={`edit-product-${product.id}`}
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={styles.deleteBtn}
                          id={`delete-product-${product.id}`}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form modal */}
      {formOpen && (
        <div className={styles.modalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {isNew ? '新しい商品を追加' : '商品を編集'}
              </h2>
              <div style={{display: 'flex', gap: '8px'}}>
                <button type="button" onClick={handleTranslate} className={styles.ctaSecondary} disabled={saving}>
                  {saving ? '翻訳中...' : '自動翻訳 (EN)'}
                </button>
                <button onClick={closeForm} className={styles.closeBtn} id="close-product-form">✕</button>
              </div>
            </div>

            <div className={styles.formGrid}>
              {/* 商品名 */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>商品名（英語）*</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={styles.fieldInput}
                  placeholder="DEAD BUTTERFLY TEE"
                  id="field-name"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.fieldLabel}>商品名（日本語）</label>
                <input
                  type="text"
                  value={form.nameJa}
                  onChange={e => setForm(f => ({ ...f, nameJa: e.target.value }))}
                  className={styles.fieldInput}
                  placeholder="デッドバタフライTシャツ"
                  id="field-name-ja"
                />
              </div>

              {/* Category & Price */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>カテゴリー*</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className={styles.fieldSelect}
                  id="field-category"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Series */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>シリーズ名（例: HANA）</label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={form.series || ''}
                  onChange={e => setForm(f => ({ ...f, series: e.target.value }))}
                  placeholder="デザインリストでグループ化されます"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.fieldLabel}>価格（円）*</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                  className={styles.fieldInput}
                  min={0}
                  id="field-price"
                />
              </div>

              {/* SUZURI URL */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>SUZURIのURL*</label>
                <input
                  type="url"
                  value={form.suzuriUrl}
                  onChange={e => setForm(f => ({ ...f, suzuriUrl: e.target.value }))}
                  className={styles.fieldInput}
                  placeholder="https://suzuri.jp/CRAZYCHILL/products/..."
                  id="field-suzuri-url"
                />
              </div>

              {/* Image */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>商品画像</label>
                <div className={styles.imageUploadArea}>
                  {form.image && (
                    <div className={styles.imagePreview}>
                      <Image src={form.image} alt="preview" fill className={styles.previewImg} />
                    </div>
                  )}
                  <div className={styles.imageControls}>
                    <input
                      type="text"
                      value={form.image}
                      onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      className={styles.fieldInput}
                      placeholder="/images/products/filename.jpg または URL"
                      id="field-image-url"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.uploadBtn}
                      disabled={uploading}
                      id="upload-image-btn"
                    >
                      {uploading ? 'アップロード中...' : '画像をアップロード'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={styles.hidden}
                    />
                  </div>
                </div>
                <p className={styles.fieldHint}>SUZURI商品画像（1024×1024）をそのままアップロード可能</p>
              </div>

              {/* Description */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>商品説明（日本語）</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={styles.fieldTextarea}
                  rows={4}
                  placeholder="商品の説明文を入力..."
                  id="field-description"
                />
              </div>

              {/* Description EN */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>商品説明（英語）</label>
                <textarea
                  value={form.descriptionEn}
                  onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))}
                  className={styles.fieldTextarea}
                  rows={4}
                  placeholder="English description..."
                  id="field-description-en"
                />
              </div>

              {/* Tags */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>タグ</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className={styles.fieldInput}
                  placeholder="コンマ区切り（例: モノクロ, パンク）"
                  id="field-tags"
                />
                <p className={styles.fieldHint}>※ 商品説明に「#パンク」のように書けば自動でタグとして登録されます。</p>
              </div>

              {/* Flags */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <div className={styles.checkboxRow}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                      id="field-published"
                    />
                    <span>公開する</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      id="field-featured"
                    />
                    <span>おすすめ商品（トップに表示）</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                      id="field-is-new"
                    />
                    <span>NEW バッジを表示</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeForm} className={styles.cancelBtn}>キャンセル</button>
              <button
                onClick={handleSave}
                className={styles.saveBtn}
                disabled={saving}
                id="save-product-btn"
              >
                {saving ? '保存中...' : isNew ? '商品を追加' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
