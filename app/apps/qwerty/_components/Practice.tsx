'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import s from '../qwerty.module.css';
import type { Dict, Mode } from './types';

function nowMs() { return Date.now(); }

export default function Practice(props: {
  dict: Dict | null;
  mode: Mode;
  chapterIdx: number;
  wordIdx: number;
  setChapterIdx: (n: number) => void;
  setWordIdx: (n: number) => void;
  hudHidden: boolean;
  setHudHidden: (v: boolean) => void;
  onToast: (t: string) => void;
  onSpeak: (t: string) => void;
  onToggleFullscreen: () => void;
}) {
  const { dict, mode, chapterIdx, wordIdx } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [typed, setTyped] = useState('');
  const [startAt, setStartAt] = useState<number | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);

  const chapter = dict?.chapters?.[chapterIdx] ?? null;
  const current = chapter?.words?.[wordIdx] ?? null;
  const target = current?.word ?? '';

  const accuracy = totalTyped === 0 ? 1 : totalCorrect / totalTyped;
  const wpm = useMemo(() => {
    if (!startAt) return 0;
    const mins = (nowMs() - startAt) / 60000;
    if (mins <= 0) return 0;
    return (totalCorrect / 5) / mins;
  }, [startAt, totalCorrect]);

  const progress = chapter?.words?.length ? Math.round(((wordIdx + 1) / chapter.words.length) * 100) : 0;

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 0); }, [wordIdx, chapterIdx, dict?.id, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const inInput = tag === 'input' || tag === 'textarea';

      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          props.setHudHidden(!props.hudHidden);
          props.onToast('HUD 已切换（H）');
          return;
        }
        if ((e.key === 'f' || e.key === 'F') && !inInput) {
          e.preventDefault();
          props.onToggleFullscreen();
          props.onToast('全屏已切换（F）');
          return;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props, inInputGuard(props.hudHidden)]);

  function inInputGuard(x:boolean){ return x; } // 防止依赖 lint 提示

  function onType(v: string) {
    if (!startAt) setStartAt(nowMs());
    setTyped(v);
  }

  function gradeAndNext() {
    if (!current) return;
    if (!typed) return;

    const len = Math.min(typed.length, target.length);
    let correct = 0;
    for (let i = 0; i < len; i++) if (typed[i] === target[i]) correct++;

    setTotalTyped(t => t + typed.length);
    setTotalCorrect(c => c + correct);
    setDoneCount(n => n + 1);

    if (typed !== target) setMistakes(m => (m.includes(target) ? m : [...m, target]));

    setTyped('');

    const total = chapter?.words?.length ?? 0;
    if (total && wordIdx + 1 >= total) {
      props.setWordIdx(0);
      return;
    }
    props.setWordIdx(wordIdx + 1);
  }

  const displayMeaning = mode === 'dictation';

  return (
    <>
      <div className={`${s.shell} ${props.hudHidden ? s.hudHidden : ''}`}>
        <div className={s.hudRow}>
          <div className={s.hudInner}>
            <div className={s.pills}>
              <div className={s.pill}><span className={s.pillLabel}>WPM</span><span className={s.pillValue}>{wpm.toFixed(1)}</span></div>
              <div className={s.pill}><span className={s.pillLabel}>准确率</span><span className={s.pillValue}>{(accuracy * 100).toFixed(1)}%</span></div>
              <div className={s.pill}><span className={s.pillLabel}>完成</span><span className={s.pillValue}>{doneCount}</span></div>
              <div className={s.pill}><span className={s.pillLabel}>错词</span><span className={s.pillValue}>{mistakes.length}</span></div>
            </div>

            <div className={s.pickers}>
              <select
                className={s.select}
                value={chapterIdx}
                onChange={(e) => { props.setChapterIdx(Number(e.target.value)); props.setWordIdx(0); setTyped(''); }}
                disabled={!dict}
              >
                {(dict?.chapters ?? []).map((c, i) => (
                  <option key={c.title} value={i}>{c.title}（{c.words.length}）</option>
                ))}
              </select>

              <div className={s.pill} style={{ padding: '8px 12px' }}>
                <span className={s.pillLabel}>位置</span>
                <span className={s.pillValue}>{dict && chapter ? `${wordIdx + 1}/${chapter.words.length}` : '--'}</span>
              </div>

              <div className={s.pill} style={{ padding: '8px 12px' }}>
                <span className={s.pillLabel}>词书</span>
                <span className={s.pillValue}>{dict ? dict.title : '—'}</span>
              </div>
            </div>
          </div>

          <div className={s.progressWrap}>
            <div className={s.progressBar} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={s.main}>
          <div className={s.practice}>
            {!current ? (
              <div style={{ opacity: 0.7, fontSize: 14 }}>没有可用词条（请打开书架选择/导入词书）</div>
            ) : (
              <>
                <div className={s.word}>
                  {target.split('').map((ch, i) => {
                    const t = typed[i];
                    const cls = t === undefined ? s.charPending : (t === ch ? s.charOk : s.charBad);
                    return <span key={i} className={cls}>{ch}</span>;
                  })}
                </div>

                <div className={s.subline}>Enter 提交 · Esc 清空 · B 书架 · H HUD · F 全屏</div>
                {!displayMeaning && current.phonetic && <div className={s.phonetic}>{current.phonetic}</div>}
                {displayMeaning && <div className={s.meaningHint}>{current.meaning}</div>}

                <input
                  ref={inputRef}
                  className={s.input}
                  value={typed}
                  onChange={(e) => onType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') gradeAndNext();
                    if (e.key === 'Escape') setTyped('');
                  }}
                  placeholder="开始输入…"
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="none"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
