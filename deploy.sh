#!/bin/bash

# 构建项目
npm run build

# 初始化 git 仓库（如果还没有）
if [ ! -d ".git" ]; then
    git init
fi

# 添加远程仓库（替换为你的 Gitee 仓库地址）
git remote add origin https://gitee.com/你的用户名/math-game.git

# 创建临时目录
mkdir -p temp_deploy

# 复制 dist 目录的内容到临时目录
cp -r dist/* temp_deploy/

# 删除 dist 目录的 git 记录（如果存在）
git rm -r --cached dist/ 2>/dev/null || true

# 添加所有文件到根目录
git add temp_deploy/*

# 提交更改
git commit -m "Deploy to Gitee Pages"

# 推送到远程仓库
git push -u origin master

# 清理临时目录
rm -rf temp_deploy 