FROM node:22

# Set node environment (default to production)
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Default ports
ARG PORT=19006
ENV PORT $PORT
EXPOSE 19006 19001 19002

# Install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# Install qemu-user-static for multi-arch support
RUN apt-get update && apt-get install -y qemu-user-static

# Install dependencies (Python, g++, make, curl, bash)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    g++ \
    make \
    curl \
    bash \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Add ngrok for Expo tunneling
RUN yarn add @expo/ngrok

# Change permissions for /opt/my-app
RUN mkdir /opt/my-app && chown root:root /opt/my-app
WORKDIR /opt/my-app
ENV PATH /opt/my-app/.bin:$PATH
USER root

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN yarn install

# Copy the rest of the project files
COPY . /opt/my-app/

# Start the Expo app
# CMD ["npx", "expo", "start", "--tunnel"]
 ENTRYPOINT [ ".docker/entrypoint.sh" ]