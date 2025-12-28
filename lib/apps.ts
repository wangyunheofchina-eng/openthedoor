export type AppItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string; // 站内路由
  blurb: string; // 轮播宣传句
};

export const apps: AppItem[] = [
  {
    id: "base64",
    title: "Base64 工具",
    subtitle: "编码 / 解码",
    href: "/tools/base64",
    blurb: "把文本快速变成可传输的格式，或一键还原。",
  },
  {
    id: "json",
    title: "JSON 格式化",
    subtitle: "美化 / 压缩 / 校验",
    href: "/tools/json",
    blurb: "粘贴 JSON，立刻变得可读、可复制、可调试。",
  },
  {
    id: "time",
    title: "时间戳转换",
    subtitle: "Unix ↔ 日期时间",
    href: "/tools/time",
    blurb: "秒/毫秒自动识别，直接输出标准 ISO 时间。",
  },
];
