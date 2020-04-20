FROM node:13


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install -g nodemon
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8999
CMD [ "npm", "start" ]

# # docker build -t test/node .
# # docker run -p 49160:8999 -d test/node
