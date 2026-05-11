# Resume Pro Max — AI-Powered Resume Builder

> 一站式智能简历编辑器 | 14 套精美模板 | AI 智能优化 | 支持 Word/PDF 导入

[中文](#chinese) | [English](#english-1)

---

## <a name="chinese">中文</a>

### 功能亮点

- **14 套精美模板**：现代渐变、极简黑白、赛博朋克、纸艺质感、清新自然、深色科技、玻璃拟态、新粗野主义、编辑杂志、开发者、创意渐变、瑞士国际、禅意极简、深海渐变
- **AI 智能优化**：粘贴目标岗位 JD，AI 自动分析岗位需求并逐模块优化简历（个人简介、工作经历、项目经验、技能标签），支持 OpenAI 兼容 API（DeepSeek、Qwen、Ollama 等）
- **文件导入**：支持上传 Word (.docx) 和 PDF 文件，自动解析并填充简历字段
- **字体自定义**：姓名/标题/正文的字号调节 + 加粗开关
- **拖拽排序**：模块可拖拽排序，灵活调整简历结构
- **中英双语**：一键切换中文/英文界面
- **多格式导出**：PDF（带分页）、HTML（可独立部署）、ZIP 包
- **本地存储**：数据保存在浏览器 localStorage，无需后端

### 快速开始

1. 下载 `index.html`，用浏览器打开
2. **推荐**使用本地服务器打开（避免 AI 功能跨域问题）：
   ```bash
   npx serve .
   # 或
   python -m http.server 8080
   ```

### 使用 AI 优化

1. 点击侧边栏「AI 设置」→ 填入 API 地址和 Key
   - DeepSeek: `https://api.deepseek.com/v1/chat/completions`
   - OpenAI: `https://api.openai.com/v1/chat/completions`
   - 或其他兼容接口
2. 点击「AI 优化」→ 粘贴目标岗位 JD → 点击「开始优化」
3. AI 会分析 JD 需求，逐模块优化你的简历
4. 不满意可点击「撤销优化」恢复原始版本

### 技术栈

- 纯前端，单文件 HTML（Vanilla JS）
- 依赖：html2pdf.js、JSZip、FileSaver、mammoth.js、pdfjs-dist、Font Awesome

---

## <a name="english-1">English</a>

### Features

- **14 Beautiful Templates**: Modern, Minimal, Cyberpunk, Paper, Nature, Dark, Glassmorphism, Neubrutalism, Magazine, Developer, Vibrant, Swiss Style, Zen Minimal, Deep Ocean
- **AI-Powered Optimization**: Paste a job description, AI analyzes requirements and optimizes each resume section. Compatible with OpenAI API format (DeepSeek, Qwen, Ollama, etc.)
- **File Import**: Upload Word (.docx) or PDF files — auto-parsed with field population
- **Font Customization**: Adjust font size for name, section titles, and body text; toggle bold
- **Drag & Drop Reorder**: Flexibly rearrange resume modules
- **Bilingual UI**: Switch between Chinese and English
- **Multi-format Export**: PDF (paginated), standalone HTML, ZIP package
- **Local Storage**: All data stored in browser localStorage, no backend

### Quick Start

1. Download `index.html` and open in browser
2. **Recommended**: Use a local server to avoid CORS issues:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

### AI Optimization

1. Click "AI Settings" → enter your API endpoint and key
2. Click "AI Optimize" → paste job JD → click "Start Optimize"
3. AI analyzes the JD and optimizes each resume section
4. Click "Undo Optimization" to revert if unsatisfied

### Tech Stack

- Pure frontend, single-file HTML (Vanilla JS)
- Dependencies: html2pdf.js, JSZip, FileSaver, mammoth.js, pdfjs-dist, Font Awesome

---

**License**: MIT | **Author**: 陈佳赫 | **Contact**: cjhyqf233@qq.com
