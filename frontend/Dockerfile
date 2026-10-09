FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173
# Vite bebohar korle nicher command thik ache. Create React App hole 'npm start' dite paren.
CMD ["npm", "run", "dev"]
