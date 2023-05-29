FROM node:slim
WORKDIR /usr/src/app
ADD src/package*.json ./
RUN npm install
ADD src/text-it.js ./
ADD src/templates ./templates/
ENV twilioAuthToken=<twilioAuthToken>
ENV twilioAccountSid=<twilioAccountSid>
CMD ["node", "text-it.js"]

