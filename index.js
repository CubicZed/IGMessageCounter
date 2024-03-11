const fs = require('fs');

// configure sender names in ./config.json
const config = require('./config.json')
const sender1 = config.sender1
const sender2 = config.sender2
const senders = [sender1, sender2];

// initialize messages/month from people
let messagesPerMonthFromPeople = {
	august: {},
	september: {},
  october: {},
  november: {},
  december: {},
  january: {},
  february: {},
  march: {}
};

// initialize data structure for each sender
senders.forEach(sender => {
  Object.keys(messagesPerMonthFromPeople).forEach(month => {
    messagesPerMonthFromPeople[month][sender.toLowerCase()] = [];
  });
});

// func to process each message
const processMessage = (message) => {
  let monthKey = null;
  // brute force month l;kjadkl;jadfsl;kjasj;kladfs;l
  if(message.timestamp_ms >= 1690851600000 && message.timestamp_ms < 1693526400000) monthKey = 'august';
  else if (message.timestamp_ms >= 1693526400000 && message.timestamp_ms < 1696118400000) monthKey = 'september';
  else if (message.timestamp_ms >= 1696118400000 && message.timestamp_ms < 1698796800000) monthKey = 'october';
  else if (message.timestamp_ms >= 1698796800000 && message.timestamp_ms < 1701388800000) monthKey = 'november';
  else if (message.timestamp_ms >= 1701388800000 && message.timestamp_ms < 1704067200000) monthKey = 'december';
  else if (message.timestamp_ms >= 1704067200000 && message.timestamp_ms < 1706745600000) monthKey = 'january';
  else if (message.timestamp_ms >= 1706745600000 && message.timestamp_ms < 1709251200000) monthKey = 'february';
  else if (message.timestamp_ms >= 1709251200000) monthKey = 'march';

  const senderName = message.sender_name.toLowerCase();

  // push message to corresponding sender
  if (monthKey && senders.map(sender => sender.toLowerCase()).includes(senderName)) {
    messagesPerMonthFromPeople[monthKey][senderName].push(message);
  }
};

// dynamically read and process files from the "./data" directory
const messageFiles = fs.readdirSync('./data');

messageFiles.forEach(file => {
  const messages = require(`./data/${file}`).messages;
  messages.forEach(processMessage);
});

// calculate total messages for each sender
let allTimeTotal = 0;
let senderTotals = senders.reduce((acc, sender) => ({ ...acc, [sender.toLowerCase()]: 0 }), {});

for (const monthMessages of Object.values(messagesPerMonthFromPeople)) {
  senders.forEach(sender => {
    const senderName = sender.toLowerCase();
    const totalMessages = monthMessages[senderName].length;
    senderTotals[senderName] += totalMessages;
    allTimeTotal += totalMessages;
  });
}

// otuput for each month
for (const [month, messages] of Object.entries(messagesPerMonthFromPeople)) {
  let monthTotal = 0;
  for (const senderMessages of Object.values(messages)) {
    monthTotal += senderMessages.length;
  }

  console.log(`
${month.charAt(0).toUpperCase() + month.slice(1)}:
  Total: ${monthTotal}`);

  senders.forEach(sender => {
    const senderName = sender.toLowerCase();
    const senderMessages = messages[senderName];
    if (senderMessages) {
      console.log(`  From ${sender}: ${senderMessages.length} (${(senderMessages.length / monthTotal) * 100}%)`);
    }
  });
}

// output totals
console.log(`\nTotal Messages: ${allTimeTotal}`);
senders.forEach(sender => {
  const senderName = sender.toLowerCase();
  console.log(`Total Messages from ${sender}: ${senderTotals[senderName]} (${(senderTotals[senderName] / allTimeTotal) * 100}%)`);
});
console.log();
