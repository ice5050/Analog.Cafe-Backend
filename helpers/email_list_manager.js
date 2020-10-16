const Promise = require("bluebird");
const request = Promise.promisify(require("request"));

const LIST_IDS_BY_GROUP_NAME = {
  tests: ["ce8add92-f51b-4fef-aff4-d4d4820928d4"],
  letters: ["15c349bb-f878-44a0-8dee-55fc33f33aa8"],
  price_updates_35: ["0d94c573-507e-4c2b-9b99-3664bae9eeb0"]
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
};

async function upsertOneSendgrid(contact, list_group) {
  const options = {
    uri: "https://api.sendgrid.com/v3/marketing/contacts",
    body: JSON.stringify({
      contacts: [contact],
      list_ids: list_group ? LIST_IDS_BY_GROUP_NAME[list_group] : undefined
    }),
    method: "PUT",
    headers
  };
  return new Promise((resolve, reject) => {
    request(options, function(error, response) {
      if (error) {
        resolve(error);
      } else {
        resolve(response);
      }
    });
  });
}

async function removeOneFromListSendgrid(email, list_group) {
  // first we need to find contact id
  const searchOptions = {
    uri: "https://api.sendgrid.com/v3/marketing/contacts/search",
    method: "POST",
    body: JSON.stringify({
      query: `email = '${email}'`
    }),
    headers
  };

  const searchResult = await new Promise((resolve, reject) => {
    request(searchOptions, function(error, response) {
      if (error) {
        resolve(error);
      } else {
        resolve(response.body);
      }
    });
  });

  let foundContact;
  try {
    foundContact = JSON.parse(searchResult).result[0];
  } catch (error) {
    // didn't receive a coherent response
  }

  // couldn't find email in sendgrid
  if (!foundContact || !foundContact.id) return "error";

  // proceed with unsubscribe action
  const unsubscribeOptions = {
    uri: `https://api.sendgrid.com/v3/marketing/lists/${LIST_IDS_BY_GROUP_NAME[list_group][0]}/contacts?contact_ids=${foundContact.id}`,
    method: "DELETE",
    headers
  };

  const unsubscribeResponse = await request(unsubscribeOptions);
  let unsubscribeJob;
  try {
    unsubscribeJob = JSON.parse(unsubscribeResponse.body).job_id;
  } catch (error) {
    // didn't receive a coherent response
  }

  return unsubscribeJob ? "ok" : "error";
}

module.exports = {
  upsertOneSendgrid,
  removeOneFromListSendgrid,
  LIST_IDS_BY_GROUP_NAME
};
