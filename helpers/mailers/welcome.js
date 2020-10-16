const { sendMail } = require("../mailer");

// show all Tuesdays for a given month/year
function getTuesdays(month, year) {
  const dateConstruct = new Date(year, month, 1);
  let tuesdays = [];
  dateConstruct.setDate(
    dateConstruct.getDate() + ((9 - dateConstruct.getDay()) % 7)
  );
  while (dateConstruct.getMonth() === month) {
    tuesdays.push(new Date(dateConstruct.getTime()));
    dateConstruct.setDate(dateConstruct.getDate() + 7);
  }
  return tuesdays;
}

// find next last Tuesday of the month
function nextLastTuesdayOfTheMonth() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const dateConstruct = new Date();
  const today = dateConstruct.getDate();
  const thisMonth = dateConstruct.getMonth();
  const thisYear = dateConstruct.getFullYear();
  const thisMonthsTuesdays = getTuesdays(thisMonth, thisYear);
  const nextMonthsTuesdays = getTuesdays(
    thisMonth < 11 ? thisMonth + 1 : 0,
    thisMonth < 11 ? thisYear : thisYear + 1
  );
  const lastTuesdayOfThisMonth = thisMonthsTuesdays[
    thisMonthsTuesdays.length - 1
  ].getDate();
  const lastTuesdayOfNextMonth = nextMonthsTuesdays[
    nextMonthsTuesdays.length - 1
  ].getDate();

  // return next last Tuesday of the month
  if (today < lastTuesdayOfThisMonth)
    return {
      month: monthNames[thisMonth],
      day: lastTuesdayOfThisMonth
    };

  return {
    month: monthNames[thisMonth < 11 ? thisMonth + 1 : 0],
    day: lastTuesdayOfNextMonth
  };
}

function welcomeEmail(email, userName) {
  sendMail({
    to: email,
    from: { email: "d@analog.cafe", name: "Dmitri from Analog.Cafe" },
    subject: "Welcome to Analog.Cafe!",
    templateId: "43cf07a0-669d-4a25-88fa-4b5e2d0f0cfe",
    substitutions: {
      analog_profile_name: userName,
      next_email_month: nextLastTuesdayOfTheMonth().month,
      next_email_day: nextLastTuesdayOfTheMonth().day
    }
  });
}

module.exports = welcomeEmail;
