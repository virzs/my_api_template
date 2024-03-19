# 使用官方 Node.js 18+ Alpine 作为基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制到工作目录
COPY . ./
# 删除 *.env
RUN rm -rf dev.env

# 安装项目依赖
COPY package.json ./package.json
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli
RUN cd ./ && rm -rf ./node_modules && pnpm install

# 编译项目
RUN pnpm run build

# 暴露应用端口
EXPOSE 5151

# 启动应用
CMD pnpm run start:prod
