FROM node:20-alpine

WORKDIR /app

RUN npm install -g @angular/cli@19

# Aumentar timeout do npm
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve"]
