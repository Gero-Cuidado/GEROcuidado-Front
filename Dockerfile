FROM node:20

# Set node environment (default to production)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Default ports
ARG PORT=19006
ENV PORT=$PORT
EXPOSE 19006 19001 19002 8081 8082

# Set the React Native packager hostname
ENV REACT_NATIVE_PACKAGER_HOSTNAME="192.168.0.15"

# Instalar o JDK 17 (ou versão compatível com o seu projeto)
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get clean

# Configurar a variável JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Instalar o Android SDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -fsSL https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -o cmdline-tools.zip && \
    unzip cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm cmdline-tools.zip

ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Instalar pacotes globais e dependências em uma etapa
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH
RUN npm install --unsafe-perm -g npm@latest expo-cli@latest eas-cli@latest && \
    apt-get update && apt-get install -y \
    qemu-user-static \
    python3 \
    python3-pip \
    g++ \
    make \
    curl \
    bash \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar o ngrok para tunelamento do Expo 
RUN yarn global add @expo/ngrok

# Set working directory
WORKDIR /opt/my-app

# Copy package files
COPY package.json ./

# Install dependencies and rebuild native modules
RUN yarn install && npm rebuild better-sqlite3

# Copy the rest of the project files
COPY . .

# Copy entrypoint script and make it executable
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["entrypoint.sh"]
