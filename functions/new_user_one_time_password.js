const admin = require("firebase-admin");
const twilio = require("./twilio");
const libphonenumber = require("google-libphonenumber");

module.exports = (req, res) => {
  if (!req.body.phone) {
    return res.status(422).send({ error: "You must provide a phone number" });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
  const possible = phoneUtil.isValidNumber(phoneUtil.parse(phone, "US"));
  if (!possible) {
    return res.status(422).send({ error: "Not valid phone number" });
  }

  admin
    .auth()
    .createUser({ uid: phone })
    .then(user => {
      const code = Math.floor(Math.random() * 8999 + 1000);

      twilio.messages.create(
        {
          body: "Your code is " + code,
          to: phone,
          from: "+18577021737"
        },
        err => {
          if (err) {
            return res.status(422).send({ error: err });
          }

          admin
            .database()
            .ref("users/" + phone)
            .update({ code: code, codeValid: true });
          res.send({ success: true });
          return null;
        }
      );
      return null;
    })
    .catch(err => res.status(422).send({ error: err }));
};
