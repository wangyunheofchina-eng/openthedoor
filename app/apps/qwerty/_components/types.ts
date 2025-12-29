export type Word = { word: string; meaning: string; phonetic?: string };
export type Dict = { id: string; title: string; lang: string; chapters: { title: string; words: Word[] }[] };
export type DictMeta = { id: string; title: string; lang: string; file: string };
export type Manifest = { version: number; dicts: DictMeta[] };
export type UserBook = { id: string; title: string; lang: string; dict: Dict };
export type Mode = 'type' | 'dictation';
export type Theme = 'dark' | 'light';
export type ShelfTab = 'mine' | 'public' | 'user';

export const LS_THEME = 'qwerty-theme';
export const LS_STATE = 'qwerty-state:v7';
export const LS_HUD = 'qwerty-hud:hidden';
export const LS_USER_BOOKS = 'qwerty-user-books:v2';
export const LS_MY_PUBLIC = 'qwerty-my-shelf:public:v1';
