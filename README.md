# Navfull 船舶气象导航网站

React + Vite 展示网站，支持中英文、航线与气象概念图、角色场景、订阅方案和合作咨询。

## 本地运行

安装依赖：`npm ci`。启动：`npm run dev`。构建：`npm run build`。

当前入口为 `src/entry.jsx`，页面为 `src/Norrvik.jsx`。主要样式为 `src/norrvik.css` 和 `src/Locale.css`。优化后的图片位于 `public/optimized`。

## 发布与分享

GitHub Pages 地址：https://nguyenthichuyen2017907-commits.github.io/newWeb/

推送至 `main` 后，`.github/workflows/deploy.yml` 自动构建并部署。部署使用 `/newWeb/` 基础路径；本地开发仍使用根路径。

## 演示边界

- 海图和气象图片为概念示意，不是实时航行数据，不应用于实际航行决策。
- 咨询表单仅保存至访问者浏览器，不会发送到后台。
- 购买与开通按钮跳转至咨询区域，未接入支付。
- 标价与服务介绍为展示内容，实际业务条款需另行确认。
