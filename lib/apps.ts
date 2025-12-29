export type AppItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string; // 站内路由
  blurb: string; // 轮播宣传句
};

export const apps: AppItem[] = [
  {
    id: "qwerty",
    title: "Qwerty 背单词",
    subtitle: "Typing Vocabulary",
    href: "/apps/qwerty",
    blurb: "像 qwerty.kaiyi.cool 一样：打字练单词 + 速度/正确率统计",
  },
];
