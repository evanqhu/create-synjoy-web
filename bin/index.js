#!/usr/bin/env node
// 声明这是一个 Node.js 可执行文件

// 导入所需的依赖包
import inquirer from "inquirer"; // 用于命令行交互
import fs from "fs-extra"; // 文件系统操作的增强版
import path from "path"; // 路径处理
import ora from "ora"; // 命令行加载动画
import gitClone from "git-clone"; // Git 仓库克隆
import chalk from "chalk"; // 命令行文字颜色

// 模板仓库的 URL
const REPO_URL = "https://github.com/evanqhu/nuxt-template/";

// 主函数：初始化项目
async function init() {
  let projectName = "";

  // 循环获取项目名称，直到得到有效输入或确认覆盖
  while (true) {
    // 提示用户输入项目名称
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project Name:",
        validate: (input) => {
          if (!input) return "Project name cannot be empty";
          return true;
        },
      },
    ]);

    projectName = answer.name;
    const targetDir = path.join(process.cwd(), projectName);

    // 检查目标目录是否已存在
    if (fs.existsSync(targetDir)) {
      // 如果目录已存在，询问是否覆盖
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Directory ${projectName} already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (overwrite) {
        // 如果用户确认覆盖，删除现有目录
        await fs.remove(targetDir);
        console.log(chalk.green(`Directory ${projectName} removed.`));
        break;
      }
    } else {
      // 目录不存在，继续执行
      break;
    }
  }

  // 设置目标目录路径
  const targetDir = path.join(process.cwd(), projectName);
  // 创建加载动画
  const spinner = ora("Downloading template...").start();

  try {
    // 克隆模板仓库
    await new Promise((resolve, reject) => {
      gitClone(REPO_URL, targetDir, {}, async (err) => {
        if (err) {
          reject(err);
          spinner.fail("Download failed!");
        } else {
          // 克隆成功后删除 .git 文件夹，避免与原仓库关联
          await fs.remove(path.join(targetDir, ".git"));
          resolve();
        }
      });
    });

    // 显示成功信息和后续步骤
    spinner.succeed("Template downloaded successfully!");
    console.log(chalk.green("\nDone! 🎉"));
    console.log(chalk.blue(`\nNext steps:\n`));
    console.log(chalk.yellow.bold(`  cd ${projectName}`));
    console.log(chalk.yellow.bold("  pnpm install"));
    console.log(chalk.yellow.bold("  pnpm run dev\n"));
  } catch (error) {
    // 处理错误情况
    spinner.fail("Download failed!");
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// 执行主函数并处理可能的错误
init().catch((err) => {
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});
