'use client';

import { useMemo, useRef, useState } from 'react';
import s from '../qwerty.module.css';
import type { Dict, DictMeta, Manifest, ShelfTab, UserBook } from './types';
import { parseTableText, safeId } from './storage';

export default function ShelfModal(props: {
  open: boolean;
  onClose: () => void;

  tab: ShelfTab;
  setTab: (t: ShelfTab) => void;

  manifest: Manifest | null;

  userBooks: UserBook[];
  setUserBooks: (fn: (prev: UserBook[]) => UserBook[]) => void;

  myPublicIds: string[];
  setMyPublicIds: (fn: (prev: string[]) => string[]) => void;

  selectPublic: (m: DictMeta) => void;
  selectUser: (b: UserBook) => void;

  onToast: (t: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [bookTitle, setBookTitle] = useState('我的词书');
  const [bookLang, setBookLang] = useState('en');
  const [tableText, setTableText] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const publicById = useMemo(() => {
    const map = new Map<string, DictMeta>();
    (props.manifest?.dicts ?? []).forEach(d => map.set(d.id, d));
    return map;
  }, [props.manifest]);

  const myPublicBooks = useMemo(() => {
    return props.myPublicIds.map(id => publicById.get(id)).filter(Boolean) as DictMeta[];
  }, [props.myPublicIds, publicById]);

  function addPublicToMine(id: string) {
    props.setMyPublicIds(prev => (prev.includes(id) ? prev : [id, ...prev]));
    props.onToast('已添加到我的书架');
  }

  function removePublicFromMine(id: string) {
    props.setMyPublicIds(prev => prev.filter(x => x !== id));
    props.onToast('已从我的书架移除');
  }

  function normalizeDict(input: any): Dict {
    const d = typeof input === 'string' ? JSON.parse(input) : input;
    const id = safeId('book');
    const title = (d?.title && String(d.title)) || 'Untitled';
    const lang = (d?.lang && String(d.lang)) || (bookLang || 'unknown');
    const chaptersRaw = Array.isArray(d?.chapters) ? d.chapters : [];

    const chapters = chaptersRaw
      .map((c: any, ci: number) => ({
        title: (c?.title && String(c.title)) || `Chapter ${ci + 1}`,
        words: (Array.isArray(c?.words) ? c.words : [])
          .map((w: any) => ({
            word: String(w?.word ?? '').trim(),
            meaning: String(w?.meaning ?? '').trim(),
            phonetic: w?.phonetic ? String(w.phonetic).trim() : undefined,
          }))
          .filter((w: any) => w.word.length > 0),
      }))
      .filter((c: any) => c.words.length > 0);

    if (chapters.length === 0) throw new Error('词书格式不对：没有有效的 chapters/words');
    return { id, title, lang, chapters };
  }

  function addUserBook(d: Dict) {
    const book: UserBook = { id: d.id, title: d.title, lang: d.lang, dict: d };
    props.setUserBooks(prev => {
      const idx = prev.findIndex(x => x.id === book.id);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = book;
        return copy;
      }
      return [book, ...prev];
    });
  }

  function createFromTable() {
    const words = parseTableText(tableText);
    if (words.length === 0) {
      props.onToast('没有识别到词条：请粘贴表格（word<TAB>meaning<TAB>phonetic可选）');
      return;
    }
    const d: Dict = {
      id: safeId('book'),
      title: (bookTitle || '我的词书').trim(),
      lang: (bookLang || 'unknown').trim(),
      chapters: [{ title: 'Imported', words }],
    };
    addUserBook(d);
    props.onToast(`已保存到自建书架（${words.length} 条）`);
    setTableText('');
    props.selectUser({ id: d.id, title: d.title, lang: d.lang, dict: d });
    props.onClose();
  }

  function importFromJsonText() {
    try {
      const d = normalizeDict(jsonText);
      addUserBook(d);
      props.onToast('已导入 JSON 到自建书架');
      setJsonText('');
      props.selectUser({ id: d.id, title: d.title, lang: d.lang, dict: d });
      props.onClose();
    } catch (e: any) {
      props.onToast(String(e?.message ?? e));
    }
  }

  async function importFromFile(file: File) {
    try {
      const name = file.name.toLowerCase();
      const txt = await file.text();

      if (name.endsWith('.json')) {
        const d = normalizeDict(txt);
        addUserBook(d);
        props.onToast('已导入 JSON 文件');
        props.selectUser({ id: d.id, title: d.title, lang: d.lang, dict: d });
        props.onClose();
        return;
      }

      const words = parseTableText(txt);
      if (words.length === 0) {
        props.onToast('文件里没有识别到词条（建议：word<TAB>meaning<TAB>phonetic可选）');
        return;
      }

      const d: Dict = {
        id: safeId('book'),
        title: (bookTitle || file.name.replace(/\.[^.]+$/, '') || '我的词书').trim(),
        lang: (bookLang || 'unknown').trim(),
        chapters: [{ title: 'Imported', words }],
      };

      addUserBook(d);
      props.onToast(`已导入文件（${words.length} 条）`);
      props.selectUser({ id: d.id, title: d.title, lang: d.lang, dict: d });
      props.onClose();
    } catch (e: any) {
      props.onToast(String(e?.message ?? e));
    }
  }

  if (!props.open) return null;

  return (
    <div className={s.shelfOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) props.onClose(); }}>
      <div className={s.shelf}>
        <div className={s.shelfTop}>
          <div className={s.shelfTitle}>书架</div>
          <button className={s.iconBtn} onClick={props.onClose} type="button">关闭</button>
        </div>

        <div className={s.shelfTabs}>
          <button className={`${s.tab} ${props.tab === 'mine' ? s.tabActive : ''}`} onClick={() => props.setTab('mine')} type="button">我的书架</button>
          <button className={`${s.tab} ${props.tab === 'public' ? s.tabActive : ''}`} onClick={() => props.setTab('public')} type="button">公共书架</button>
          <button className={`${s.tab} ${props.tab === 'user' ? s.tabActive : ''}`} onClick={() => props.setTab('user')} type="button">自建书架</button>
        </div>

        <div className={s.shelfBody}>
          {props.tab === 'mine' && (
            <>
              <div className={s.smallHint} style={{ marginBottom: 10 }}>我的书架 = 自建词书 + 公共收藏</div>
              <div className={s.shelfGrid}>
                {props.userBooks.map(b => (
                  <div className={s.book} key={b.id} onClick={() => props.selectUser(b)} role="button" tabIndex={0}>
                    <div className={s.bookBadge}>{b.lang.toUpperCase().slice(0, 2)}</div>
                    <div className={s.bookMain}>
                      <div className={s.bookName}>{b.title}</div>
                      <div className={s.bookMeta}>来源：自建</div>
                    </div>
                  </div>
                ))}

                {myPublicBooks.map(m => (
                  <div className={s.book} key={m.id} onClick={() => props.selectPublic(m)} role="button" tabIndex={0}>
                    <div className={s.bookBadge}>{m.lang.toUpperCase().slice(0, 2)}</div>
                    <div className={s.bookMain}>
                      <div className={s.bookName}>{m.title}</div>
                      <div className={s.bookMeta}>来源：公共收藏 · 语言：{m.lang}</div>
                      <div className={s.row} style={{ justifyContent: 'flex-end' }}>
                        <button className={s.danger} onClick={(e) => { e.stopPropagation(); removePublicFromMine(m.id); }} type="button">移除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {props.userBooks.length === 0 && myPublicBooks.length === 0 && (
                <div className={s.smallHint} style={{ marginTop: 10 }}>你的书架还是空的：去公共书架“添加”，或在自建书架里粘贴导入。</div>
              )}
            </>
          )}

          {props.tab === 'public' && (
            <div className={s.shelfGrid}>
              {(props.manifest?.dicts ?? []).map(m => {
                const added = props.myPublicIds.includes(m.id);
                return (
                  <div className={s.book} key={m.id} onClick={() => props.selectPublic(m)} role="button" tabIndex={0}>
                    <div className={s.bookBadge}>{m.lang.toUpperCase().slice(0, 2)}</div>
                    <div className={s.bookMain}>
                      <div className={s.bookName}>{m.title}</div>
                      <div className={s.bookMeta}>来源：平台 · 语言：{m.lang}</div>
                      <div className={s.row} style={{ justifyContent: 'flex-end' }}>
                        <button className={added ? s.secondary : s.primary} onClick={(e) => { e.stopPropagation(); addPublicToMine(m.id); }} type="button">
                          {added ? '已添加' : '添加到我的书架'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {props.tab === 'user' && (
            <>
              <div className={s.smallHint}>
                推荐：从 Excel/表格复制三列粘贴（word / meaning / phonetic 可选）。每行一条。
              </div>

              <div className={s.row} style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input className={s.select} value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="词书名" />
                  <input className={s.select} value={bookLang} onChange={(e) => setBookLang(e.target.value)} placeholder="语言（en/ja/de/zh/code…）" />
                  <button className={s.iconBtn} onClick={() => fileRef.current?.click()} type="button">
                    导入文件（CSV/TSV/JSON）
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.tsv,.txt,.json,application/json,text/csv,text/tab-separated-values,text/plain"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) importFromFile(f);
                      e.currentTarget.value = '';
                    }}
                  />
                </div>
              </div>

              <textarea
                className={s.textarea}
                value={tableText}
                onChange={(e) => setTableText(e.target.value)}
                placeholder={"粘贴示例（TAB 分隔）：\nhello\t你好\t/həˈləʊ/\nDanke\t谢谢\nありがとう\t谢谢"}
              />

              <div className={s.row}>
                <button className={s.secondary} onClick={() => setTableText('')} type="button">清空</button>
                <button className={s.primary} onClick={createFromTable} type="button">保存到自建书架</button>
              </div>

              <div style={{ marginTop: 10 }}>
                <button className={s.iconBtn} onClick={() => setAdvancedOpen(v => !v)} type="button">
                  {advancedOpen ? '收起高级' : '高级：JSON 导入'}
                </button>
                {advancedOpen && (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      className={s.textarea}
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      placeholder="粘贴 JSON 词书（给高级用户用）"
                    />
                    <div className={s.row}>
                      <button className={s.secondary} onClick={() => setJsonText('')} type="button">清空</button>
                      <button className={s.primary} onClick={importFromJsonText} type="button">导入 JSON</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className={s.shelfFooter}>
          <div className={s.smallHint}>公共书架由平台提供；自建书架保存在本机浏览器（后续可做账号同步）。</div>
          <div className={s.smallHint}>快捷键：B 打开书架</div>
        </div>
      </div>
    </div>
  );
}
