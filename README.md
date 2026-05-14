# MOMO工具箱 (Momo Toolbox)

[English Version](./README.en.md) | **中文版**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

MOMO工具箱是一个为您量身定制的一站式在线平台，旨在简化您的日常数字任务。不论是文本转换、图像处理还是开发调试，您都能在这里找到趁手的工具，无需下载，即点即用。

---

## 🔥 核心特色 (Core Features)

项目涵盖了多个维度的实用工具，专为现代工作流打造，支持 **中英双语** 自动切换、**暗黑模式**。

### 1. 🖼️ 图像处理 (Image)
- **AI 智能抠图**：上传图片即可一键智能抠图，支持强大的手动画笔与橡皮擦模式。
- **EXIF 查看/抹除**：查看并一键抹除照片中的相机型号、GPS 定位等敏感隐私信息。
- **纵横比计算**：轻松计算图像、视频和其他画幅布局的完美纵横比比例。

### 2. 💻 开发者工具 (Developer)
- **API Token 测速**：支持流式输出测速。一键并发测速，对比各家模型响应时间和生成速度。
- **AI 正则生成器**：用自然语言描述需求，瞬间生成正则表达式与解析。
- **代码截图美化**：创建精美、带语法高亮的分享级代码截图，一键下载。
- **JSON 格式化**：美化、压缩并校验 JSON 数据结构是否合理合法。

### 3. ✍️ 文本处理 (Text)
- **AI 文本润色**：输入文本，AI 自动提升文章表达的专业性、创意或流畅度。
- **Markdown 编辑器**：实时预览的编辑器，支持导出和极客排版。
- **大小写转换**：在全大写、全小写、首字母大写等格式间一键切换。

### 4. 🚀 效率提升 (Productivity)
- **本地密码生成**：生成高强度、随机密码，全本地运行。
- **番茄钟专注**：利用 25/5 分钟的专注/休息循环法提升工作效率。
- **单位转换器**：在长度、重量、温度等常见单位之间进行精准转换。

### 5. 🎮 休闲娱乐 (Entertainment)
- **经典游戏**：包含经典贪吃蛇、五子棋 (AI)、国际象棋及中国象棋，全部即点即玩。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端核心**: React 18 + Vite 6
- **样式执行**: Tailwind CSS 4 & Lucide React
- **动效处理**: Motion (Framer Motion)
- **路由系统**: React Router 7 (单页应用架构)
- **部署环境**: 兼容 Vercel/Cloud Run，支持 SPA 路由回退 (No More 404s)

---

## ✨ 最新优化 (Recent Updates)

### 移动端体验优化
- **Viewport 优化**: 允许用户缩放，支持刘海屏适配
- **触摸交互优化**: 移除点击高亮，优化滚动体验
- **响应式布局**: 优化移动端卡片高度和间距
- **PWA 支持**: 支持添加到主屏幕，离线访问

### SEO 优化
- **结构化数据**: 添加 JSON-LD 格式的结构化数据
- **语义化标签**: 添加 H1 标签和语义化 HTML
- **Sitemap**: 完整的网站地图，包含所有工具和静态页面
- **Open Graph**: 优化社交媒体分享效果

### 性能优化
- **组件懒加载**: 所有重型工具使用 React.lazy 实现代码分割
- **构建优化**: 优化 Vite 配置，减小 bundle 大小
- **广告自动刷新**: 路由切换时自动刷新广告
- **Google Analytics**: 集成网站分析

### AI 集成
- **IMA 技能**: 集成腾讯 IMA 笔记和知识库管理
- **AI 内容检测**: 基于语言模式的 AI 内容检测工具

---

## 🚀 快速开始 (Getting Started)

### 环境要求
- Node.js 18+

### 本地开发
1. **克隆项目并安装依赖**:
   ```bash
   npm install
   ```

2. **环境变量**:
   在开发环境配置您的 Gemini API Key 以解锁 AI 功能：
   ```env
   # 在 AI Studio 环境变量设置中配置
   GEMINI_API_KEY=your_key
   ```

3. **启动服务**:
   ```bash
   npm run dev
   ```

---

## 🛡️ 隐私与安全 (Privacy)

我们高度尊重您的隐私。除非涉及必要的 AI 联网功能（数据经过加密传输且不存储），本站绝大部分计算（如抠图、哈希计算、密码生成等）均在您的浏览器**本地完成**。数据绝不上传，让您的敏感信息始终掌控在自己手中。

---

## 📬 联系我们 (Contact)

如果您有任何建议、反馈或需要定制功能，请随时通过以下方式联系：

- **Email**: 1902243211@qq.com

---

## 📜 许可证 (License)
本项目基于 **Apache-2.0** 许可证开源。

---
*Created by MOMO工具箱 STUDIO.*
