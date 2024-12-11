FROM node:14.20 AS development

WORKDIR /usr/rose-finch

# COPY package.json ./

# RUN npm install

COPY . .
