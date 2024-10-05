FROM node:20.11.0 as node
WORKDIR /app
COPY . .
RUN npm cache clean --force
#RUN npm config fix
RUN npm install --legacy-peer-deps
RUN npm run  buildWithConfig  staging
#stage 2
FROM nginx:latest
COPY --from=node /app/dist/proset-webapp /usr/share/nginx/html
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80 4200