const Imap = require('imap');
const {simpleParser} = require('mailparser');
const imapConfig = {
  user: 'postmaster@example.com',
  password: '123456',
  host: 'mail.example.com',
  port: 993,
  tls: true,
};

const getEmails = () => {
    try {
      let messages = [];
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['ALL', ['BEFORE', new Date()]], (err, results) => {
            const f = imap.fetch(results, {bodies: ''});
            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream, async (err, parsed) => {
                  const {from, subject, textAsHtml, text} = parsed;
                  console.log(parsed);
                  /* Make API call to save the data
                     Save the retrieved data into a database.
                     E.t.c
                  */
                messages.push({
                    from:from, subject:subject, textAsHtml:textAsHtml, text:text
                })
                });
              });
              msg.once('attributes', attrs => {
                const {uid} = attrs;
                imap.addFlags(uid, ['\\Seen'], () => {
                  // Mark the email as read after reading it
                  console.log('Marked as read!');
                });
              });
            });
            f.once('error', ex => {
              return Promise.reject(ex);
            });
            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      });
  
      imap.once('error', err => {
        console.log(err);
      });
  
      imap.once('end', () => {
        console.log('Connection ended');
      });
  
      imap.connect();
      return messages;
    } catch (ex) {
      console.log('an error occurred');
    }
  };
  
  module.exports;
  
  
  
