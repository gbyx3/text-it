FROM node:slim
WORKDIR /usr/src/app
ADD src/package*.json ./
RUN npm install
ADD src/text-it.js ./
ADD src/templates ./templates/
ENV twilioAuthToken=<twilioAuthToken> # Change this to your Twilio Auth Token
ENV twilioAccountSid=<twilioAccountSid> # Change this to your Twilio Account SID
CMD ["node", "text-it.js"]

