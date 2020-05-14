FROM node:13.12.0
WORKDIR /opt/shopsaver-backend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]