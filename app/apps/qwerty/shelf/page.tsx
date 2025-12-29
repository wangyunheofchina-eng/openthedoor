'use client';

import { useEffect, useMemo, useState } from 'react';
import s from '../qwerty.module.css';

type Word = { word: string; meaning: string; phonetic?: string };
type Dict = { id: string; title: string; lang: string; chapters: { title: string; words: Word[] }[] };
type DictMeta = { id: string; title: string; lang: string; file: string };
type Manifest = { version: number; dicts: DictMeta[] };
type UserBook = { id: string; title: string; lang: string; dict: Dict };
type Theme = 'dark' | 'light';

const LS_USER_BOOKS = 'qwerty-user-books:v2';
const LS_MY_PUBLIC = 'qwerty-my-shelf:public:v1';
const LS_STATE = 'qwerty-state:v7';
const LS_THEME = 'qwerty-theme';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, val: any) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function QwertyShelf() {
  const [theme, setTheme] = useState<Theme>('light');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [myPublicIds, setMyPublicIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'mine' | 'public'>('mine');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(LS_THEME);
    if (t === 'dark' || t === 'light') setTheme(t);

    setUserBooks(loadJson<UserBook[]>(LS_USER_BOOKS, []));
    setMyPublicIds(loadJson<string[]>(LS_MY_PUBLIC, []));
  }, []);

  useEffect(() => {
    saveJson(LS_MY_PUBLIC, myPublicIds);
  }, [myPublicIds]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr(null);
        const res = await fetch('/qwerty/dicts/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const mf = (await res.json()) as Manifest;
        if (cancelled) return;
        setManifest(mf);
      } catch (e: any) {
        if (cancelled) return;
        setErr(String(e?.message ?? e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const publicById = useMemo(() => {
    const map = new Map<string, DictMeta>();
    (manifest?.dicts ?? []).forEach(d => map.set(d.id, d));
    return map;
  }, [manifest]);

  const myPublicBooks = useMemo(() => {
    return myPublicIds.map(id => publicById.get(id)).filter(Boolean) as DictMeta[];
  }, [myPublicIds, publicById]);

  function openPublic(meta: DictMeta) {
    saveJson(LS_STATE, {
      ...(loadJson<any>(LS_STATE, {})),
      source: 'public',
      dictId: meta.id,
      chapterIdx: 0,
      wordIdx: 0,
    });
    window.location.href = '/apps/qwerty';
  }

  function openUser(book: UserBook) {
    saveJson(LS_STATE, {
      ...(loadJson<any>(LS_STATE, {})),
      source: 'user',
      dictId: book.id,
      chapterIdx: 0,
      wordIdx: 0,
    });
    window.location.href = '/apps/qwerty';
  }

  function addPublic(id: string) {
    setMyPublicIds(ids => (ids.includes(id) ? ids : [id, ...ids]));
  }

  function removePublic(id: string) {
    setMyPublicIds(ids => ids.filter(x => x !== id));
  }

  return (
    <main className={`${s.page} ${s.shelfPage}`} data-theme={theme}>
      <div className={s.shelfTopbar}>
        <div className={s.shelfTopbarInner}>
          <div>
            <a className={s.link} href="/apps/qwerty">← 返回练习</a>
          </div>

          <div className={s.shelfTitleCenter}>我的书架</div>

          <div className={s.shelfRight}>
            <div className={s.segment}>
              <button className={tab === 'mine' ? `${s.segBtn} ${s.segBtnActive}` : s.segBtn} onClick={() => setTab('mine')} type="button">
                我的书架
              </button>
              <button className={tab === 'public' ? `${s.segBtn} ${s.segBtnActive}` : s.segBtn} onClick={() => setTab('public')} type="button">
                公共书架
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={s.shelfContent}>
        {err && <div className={s.emptyState}>加载失败：{err}</div>}

        {tab === 'mine' && (
          <>
            <div className={s.shelfSection}>
              <div className={s.shelfSectionHead}>
                <div className={s.shelfSectionTitle}>自建词书</div>
                <div className={s.shelfSectionHint}>在练习页的“书架 → 自建书架”里新建/导入</div>
              </div>

              {userBooks.length === 0 ? (
                <div className={s.emptyState}>还没有自建词书。</div>
              ) : (
                <div className={s.shelfGridWide}>
                  {userBooks.map(b => (
                    <div className={s.book} key={b.id} onClick={() => openUser(b)} role="button" tabIndex={0}>
                      <div className={s.bookBadge}>{b.lang.toUpperCase().slice(0, 2)}</div>
                      <div className={s.bookMain}>
                        <div className={s.bookName}>{b.title}</div>
                        <div className={s.bookMeta}>来源：自建 · 点击开始练习</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={s.shelfSection}>
              <div className={s.shelfSectionHead}>
                <div className={s.shelfSectionTitle}>公共收藏</div>
                <div className={s.shelfSectionHint}>从公共书架添加到这里</div>
              </div>

              {myPublicBooks.length === 0 ? (
                <div className={s.emptyState}>还没有收藏公共词书。</div>
              ) : (
                <div className={s.shelfGridWide}>
                  {myPublicBooks.map(m => (
                    <div className={s.book} key={m.id} onClick={() => openPublic(m)} role="button" tabIndex={0}>
                      <div className={s.bookBadge}>{m.lang.toUpperCase().slice(0, 2)}</div>
                      <div className={s.bookMain}>
                        <div className={s.bookName}>{m.title}</div>
                        <div className={s.bookMeta}>来源：公共收藏 · 点击开始练习</div>
                        <div className={s.bookActions}>
                          <button className={s.danger} onClick={(e) => { e.stopPropagation(); removePublic(m.id); }} type="button">
                            移除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'public' && (
          <div className={s.shelfSection}>
            <div className={s.shelfSectionHead}>
              <div className={s.shelfSectionTitle}>公共书架</div>
              <div className={s.shelfSectionHint}>点击卡片可直接练习；也可以添加到“我的书架”</div>
            </div>

            <div className={s.shelfGridWide}>
              {(manifest?.dicts ?? []).map(m => {
                const added = myPublicIds.includes(m.id);
                return (
                  <div className={s.book} key={m.id} onClick={() => openPublic(m)} role="button" tabIndex={0}>
                    <div className={s.bookBadge}>{m.lang.toUpperCase().slice(0, 2)}</div>
                    <div className={s.bookMain}>
                      <div className={s.bookName}>{m.title}</div>
                      <div className={s.bookMeta}>语言：{m.lang}</div>
                      <div className={s.bookActions}>
                        <button
                          className={added ? s.secondary : s.primary}
                          onClick={(e) => { e.stopPropagation(); addPublic(m.id); }}
                          type="button"
                        >
                          {added ? '已添加' : '添加到我的书架'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
