FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN yarn global add tsx esbuild
RUN yarn install && mv node_modules ../
COPY . .
EXPOSE 5005
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "run", "dev"]
