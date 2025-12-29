'use client';

import { useEffect, useState } from 'react';
import s from './qwerty.module.css';
import type { Dict, DictMeta, Manifest, Mode, ShelfTab, Theme, UserBook } from './_components/types';
import { loadJson, saveJson } from './_components/storage';
import { LS_HUD, LS_MY_PUBLIC, LS_STATE, LS_THEME, LS_USER_BOOKS } from './_components/types';
import Practice from './_components/Practice';
import ShelfModal from './_components/ShelfModal';

function speak(text: string) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  synth.speak(u);
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {}
}

export default function Qwerty() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mode, setMode] = useState<Mode>('type');
  const [hudHidden, setHudHidden] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [manifest, setManifest] = useState<Manifest | null>(null);

  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [myPublicIds, setMyPublicIds] = useState<string[]>([]);

  const [source, setSource] = useState<'public' | 'user'>('public');
  const [publicMeta, setPublicMeta] = useState<DictMeta | null>(null);
  const [dict, setDict] = useState<Dict | null>(null);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  const [shelfOpen, setShelfOpen] = useState(false);
  const [shelfTab, setShelfTab] = useState<ShelfTab>('public');

  useEffect(() => {
    const t = localStorage.getItem(LS_THEME);
    if (t === 'dark' || t === 'light') setTheme(t);

    const h = localStorage.getItem(LS_HUD);
    if (h === '1') setHudHidden(true);

    setUserBooks(loadJson<UserBook[]>(LS_USER_BOOKS, []));
    setMyPublicIds(loadJson<string[]>(LS_MY_PUBLIC, []));

    const st = loadJson<any>(LS_STATE, {});
    if (st?.mode === 'type' || st?.mode === 'dictation') setMode(st.mode);
    if (st?.source === 'public' || st?.source === 'user') setSource(st.source);
    if (Number.isFinite(st?.chapterIdx)) setChapterIdx(st.chapterIdx);
    if (Number.isFinite(st?.wordIdx)) setWordIdx(st.wordIdx);
  }, []);

  useEffect(() => { try { localStorage.setItem(LS_THEME, theme); } catch {} }, [theme]);
  useEffect(() => { try { localStorage.setItem(LS_HUD, hudHidden ? '1' : '0'); } catch {} }, [hudHidden]);
  useEffect(() => { saveJson(LS_USER_BOOKS, userBooks); }, [userBooks]);
  useEffect(() => { saveJson(LS_MY_PUBLIC, myPublicIds); }, [myPublicIds]);

  useEffect(() => {
    saveJson(LS_STATE, {
      mode,
      source,
      dictId: source === 'public' ? publicMeta?.id ?? null : dict?.id ?? null,
      chapterIdx,
      wordIdx,
    });
  }, [mode, source, publicMeta?.id, dict?.id, chapterIdx, wordIdx]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/qwerty/dicts/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const mf = (await res.json()) as Manifest;
        if (cancelled) return;
        setManifest(mf);

        const st = loadJson<any>(LS_STATE, {});
        const savedId = st?.dictId ?? null;
        const savedSource = st?.source ?? null;

        if (savedSource === 'user' && savedId) {
          const ub = loadJson<UserBook[]>(LS_USER_BOOKS, []).find(b => b.id === savedId);
          if (ub) {
            setSource('user');
            setDict(ub.dict);
            return;
          }
        }

        const pick = mf.dicts.find(d => d.id === savedId) ?? mf.dicts[0] ?? null;
        setSource('public');
        setPublicMeta(pick);
      } catch (e:any) {
        setToast(`公共书架加载失败：${String(e?.message ?? e)}`);
      }
    })();
    return () => { cancelled = TrueGuard(cancelled); };
  }, []);

  function TrueGuard(x:boolean){ return x; }

  useEffect(() => {
    if (source !== 'public') return;
    if (!publicMeta) return;

    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(publicMeta.file, { cache: 'no-store', signal: ac.signal });
        if (!res.ok) throw new Error(`dict ${res.status}`);
        const d = (await res.json()) as Dict;
        setDict(d);
        setChapterIdx(0);
        setWordIdx(0);
      } catch (e:any) {
        if (ac.signal.aborted) return;
        setToast(`词书加载失败：${String(e?.message ?? e)}`);
        setDict(null);
      }
    })();
    return () => ac.abort();
  }, [source, publicMeta?.id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const inInput = tag === 'input' || tag === 'textarea';

      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setShelfOpen(v => !v);
          setShelfTab('public');
          return;
        }
        if ((e.key === 'f' || e.key === 'F') && !inInput) {
          e.preventDefault();
          toggleFullscreen();
          setToast('全屏已切换（F）');
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setHudHidden(v => !v);
          setToast('HUD 已切换（H）');
          return;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function selectPublic(m: DictMeta) {
    setSource('public');
    setPublicMeta(m);
    setShelfOpen(false);
    setChapterIdx(0);
    setWordIdx(0);
    setToast(`已切换：${m.title}`);
  }

  function selectUser(b: UserBook) {
    setSource('user');
    setDict(b.dict);
    setShelfOpen(false);
    setChapterIdx(0);
    setWordIdx(0);
    setToast(`已切换：${b.title}`);
  }

  return (
    <main className={s.page} data-theme={theme}>
      <div className={s.hudTop}>
        <div className={s.hudLeft}>
          <a className={s.link} href="/">← Back</a>
        </div>

        <div className={s.hudRight}>
          <div className={s.segment}>
            <button className={mode === 'type' ? `${s.segBtn} ${s.segBtnActive}` : s.segBtn} onClick={() => setMode('type')} type="button">
              打字
            </button>
            <button className={mode === 'dictation' ? `${s.segBtn} ${s.segBtnActive}` : s.segBtn} onClick={() => setMode('dictation')} type="button">
              默写
            </button>
          </div>

          <button className={s.iconBtn} onClick={() => { setShelfOpen(true); setShelfTab('mine'); }} type="button" title="我的书架">
            我的书架
          </button>

          <button className={s.iconBtn} onClick={() => { setShelfOpen(true); setShelfTab('public'); }} type="button" title="书架（B）">
            书架
          </button>

          <button className={s.iconBtn} onClick={() => setHudHidden(v => !v)} type="button" title="HUD（H）">HUD</button>
          <button className={s.iconBtn} onClick={() => toggleFullscreen()} type="button" title="全屏（F）">⛶</button>

          <button className={s.iconBtn} onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} type="button" title="明暗">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button className={s.iconBtn} onClick={() => dict && dict.chapters?.[chapterIdx]?.words?.[wordIdx]?.word && speak(dict.chapters[chapterIdx].words[wordIdx].word)} type="button" title="发音">
            🔊
          </button>

          <button className={s.iconBtn} onClick={() => { setChapterIdx(0); setWordIdx(0); setToast('已重置'); }} type="button" title="重置">
            重置
          </button>
        </div>
      </div>

      <Practice
        dict={dict}
        mode={mode}
        chapterIdx={chapterIdx}
        wordIdx={wordIdx}
        setChapterIdx={setChapterIdx}
        setWordIdx={setWordIdx}
        hudHidden={hudHidden}
        setHudHidden={setHudHidden}
        onToast={setToast}
        onSpeak={speak}
        onToggleFullscreen={() => toggleFullscreen()}
      />

      <ShelfModal
        open={shelfOpen}
        onClose={() => setShelfOpen(false)}
        tab={shelfTab}
        setTab={setShelfTab}
        manifest={manifest}
        userBooks={userBooks}
        setUserBooks={(fn) => setUserBooks(fn)}
        myPublicIds={myPublicIds}
        setMyPublicIds={(fn) => setMyPublicIds(fn)}
        selectPublic={selectPublic}
        selectUser={selectUser}
        onToast={setToast}
      />

      {toast && <div className={s.toast}>{toast}</div>}
    </main>
  );
}
