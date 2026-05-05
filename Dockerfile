# Imagem base Node.js
FROM node:20.15.1-alpine

LABEL maintainer="SISMOB - SMTR"

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências de produção
RUN npm install --only=production

# Copia o restante do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
