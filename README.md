# GEROcuidado Mobile App
[![React Native](https://img.shields.io/badge/React%20Native-%5E0.68-blue)](https://reactnative.dev/) 
[![Expo](https://img.shields.io/badge/Expo-%5E48.0.0-lightgrey)](https://expo.dev/) 
[![Node.js](https://img.shields.io/badge/Node.js-^18-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-^9.0.0-red)](https://nestjs.com/)

## Como rodar o projeto

### 1. Clonar o repositório:
```bash
git clone https://github.com/fga-eps-mds/2023-2-GEROcuidado-Front.git
```

### 2. Acessar o diretório do projeto:
```bash
cd 2023-2-GEROcuidado-Front/
```

### 3. Construir a imagem Docker:
```bash
docker build -t gerocuidado-front .
```

### 4. Iniciar o container e entrar como root:
```bash
docker run -it --rm --user root gerocuidado-front /bin/bash
```


### OBSERVAÇÕES IMPORTANTES

1. Para testar a aplicação no celular, basta subir o container com os passos acima, ter baixado no seu dispositivo o aplicativo EXPO GO e por fim acessar o link exp://192.168.0.9:8081 no seu navegador. (A aplicação não aparecerá automaticamente no aplicativo do EXPO GO, é necessário acessar o link)

2. Para testar a aplicação no celular em ambiente de desenvolvimento, é necessário também remover essa configuração do app.json:

```json
"eas": {
  "projectId": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx"
}
```

## Testes Unitários

Para rodar os testes unitários, basta executar o comando:
```bash
docker compose -f docker-compose.test.yml up
```

## QR Code para testes
### IOS
![IOS](https://github.com/fga-eps-mds/2023-2-GEROcuidado-Front/assets/51385738/1a9562d5-dec5-485d-999a-59f2f16e2427)
### Android
![Android](https://github.com/fga-eps-mds/2023-2-GEROcuidado-Front/assets/51385738/9a6d23c0-2f88-42de-ac26-719e6faa9fd3)
### 📝 Notes

- [Expo Router: Docs](https://expo.github.io/router)
- [Expo Router: Repo](https://github.com/expo/router)

---
