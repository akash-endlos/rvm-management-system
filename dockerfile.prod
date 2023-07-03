# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY . .

# Install app dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Set the command to start the server
CMD ["npm", "start"]