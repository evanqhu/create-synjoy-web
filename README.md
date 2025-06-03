# create-synjoy-web

一个用于快速创建 Nuxt3 模板项目的 CLI 工具。

## 特性 Features

- 支持选择不同分支（如 `main`、`tailwind`）的模板
- 自动克隆并初始化项目目录
- 友好的命令行交互体验
- 自动清理 `.git`，避免与原仓库关联

## 安装 Installation

```bash
npm install -g create-synjoy-web
```

## 使用 Usage

在命令行中运行：

```bash
create-synjoy-web
# or
npm create synjoy-web
# or
npx create-synjoy-web
```

根据提示选择模板分支并输入项目名称。如果目标目录已存在，可以选择是否覆盖。

### 初始化完成后，进入项目目录并安装依赖：

```bash
cd <your-project-name>
pnpm install
pnpm run dev
```

## 依赖 Dependencies

- @inquirer/prompts
- chalk
- commander
- fs-extra
- git-clone
- inquirer
- ora

## 许可证 License

ISC
