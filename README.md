# GEROcuidado Mobile App

[![React Native](https://img.shields.io/badge/React%20Native-%5E0.68-blue)](https://reactnative.dev/) 
[![Expo](https://img.shields.io/badge/Expo-%5E48.0.0-lightgrey)](https://expo.dev/) 
[![Node.js](https://img.shields.io/badge/Node.js-^18-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-^9.0.0-red)](https://nestjs.com/)

## Instruções para Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/fga-eps-mds/2023-2-GEROcuidado-Front.git
```

### 2. Acessar o Diretório do Projeto

```bash
cd 2023-2-GEROcuidado-Front/
```

### 3. Construir a Imagem Docker

```bash
docker build -t gerocuidado-front .
```

### 4. Executar o Container

```bash
docker run -it --rm -p 8081:8081 -p 19006:19006 --user root gerocuidado-front /bin/bash
```

### 5. Acessar o App via Expo Go

- **Modo Expo Go**: Abra o app **Expo Go** no seu celular, escaneie o QR Code gerado no terminal ao iniciar o Expo e execute o app diretamente no dispositivo.
- **Development Build**: Se você estiver usando o modo **development build**, escaneie o QR Code ou insira o link gerado diretamente no Expo Go.

### Observação Importante

No arquivo `Dockerfile`, altere o parâmetro `REACT_NATIVE_PACKAGER_HOSTNAME` para o IP da sua máquina local. Substitua `"192.168.0.15"` pelo seu endereço IP:

```dockerfile
ENV REACT_NATIVE_PACKAGER_HOSTNAME="seu.endereco.ip"
```

---

## Testes Unitários

Para executar os testes unitários, utilize o comando:

```bash
docker-compose -f docker-compose.test.yml up
```

---

### Recursos Úteis

- [Expo Router: Documentação](https://expo.github.io/router)
- [Expo Router: Repositório](https://github.com/expo/router)
