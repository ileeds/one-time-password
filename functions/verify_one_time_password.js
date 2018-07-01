const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.code || !req.body.phone) {
    return res.status(422).send({ error: 'Phone and code must be provided' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);

  admin.auth().getUser(phone)
    .then(userRecord => {
      const ref = admin.database().ref('users/' + phone);
      ref.once('value', snapshot => {
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }

        ref.update({ codeValid: false });
        admin.auth().createCustomToken(phone)
          .then(token => res.send({ token: token }))
          .catch(err => res.status(422).send({ error: err }));
        return null;
      });
      return null;
    })
    .catch(err => {
      res.status(422).send({ error: err });
    });
    return null;
}
