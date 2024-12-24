const GUESTBOOK_URL = "https://vixen.yuril.net/guestbook";

type GuestbookEntry = {
  name: string,
  websiteContact: string,
  messageBody: string,
  timestamp: number,
  index: number
};

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGuestbook(): Promise<GuestbookEntry[] | undefined> {
  try {
    const response = await fetch(GUESTBOOK_URL);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching the data:', error);
  }
}

function guestbookDate(timestamp: number): string {
  const dateObj = new Date(timestamp);
  return dateObj.toISOString().substring(0, 16) + 'Z';
}

async function updateGuestbook(): Promise<boolean> {
  const guestbook = await fetchGuestbook();
  if (guestbook === undefined) {
    document.querySelectorAll('.guestbook-box').forEach(function (e) {
      e.remove();
    });
    document.getElementById('main')?.appendChild(document.createTextNode(
      'Fetching guestbook from server failed :( Please reload to try again'
    ));
    return false;
  }
  guestbook.sort(function (a, b) { return b.timestamp - a.timestamp; });
  const guestbookBoxes = guestbook.map(function (entry) {
    const guestbookBox = document.createElement('div');
    guestbookBox.className = 'guestbook-box';

    const guestbookHeader = document.createElement('header');
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.appendChild(document.createTextNode(
      guestbookDate(entry.timestamp)));
    guestbookHeader.appendChild(timeDiv);
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.appendChild(document.createTextNode(entry.name));
    guestbookHeader.appendChild(nameDiv);
    if (entry.websiteContact) {
      const contactDiv = document.createElement('div');
      contactDiv.appendChild(document.createTextNode(
        'Website/Contact: ' + entry.websiteContact));
      guestbookHeader.appendChild(contactDiv);
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.appendChild(document.createTextNode(entry.messageBody));

    guestbookBox.replaceChildren(
      guestbookHeader,
      document.createElement('hr'),
      messageDiv
    );

    return guestbookBox;
  });
  document.getElementById('guestbook-entries')?.replaceChildren(
    ...guestbookBoxes);
  return true;
}

async function submitHandler(event: SubmitEvent) {
  event.preventDefault();
  const nameElt = <HTMLInputElement>document.getElementById('entry-name');
  const contactElt = <HTMLInputElement>document.getElementById('entry-contact');
  const msgElt = <HTMLInputElement>document.getElementById('entry-body');
  const entryData = {
    name: nameElt.value,
    websiteContact: contactElt.value,
    messageBody: msgElt.value,
  };
  const submissionStatusElt = document.getElementById('submission-status');

  try {
    const response = await fetch(GUESTBOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({entry: entryData}),
    });

    if (response.status === 201) {
      (<HTMLFormElement>document.getElementById('entry-form')).reset();
      submissionStatusElt?.replaceChildren(document.createTextNode(
        'Submission successful!'
      ));
      setTimeout(updateGuestbook, 500);
    } else {
      const errorMsg = await response.text();
      submissionStatusElt?.replaceChildren(document.createTextNode(
        'Server error :('
      ));
      console.error('Server responded with:', response.status, errorMsg);
    }
  } catch (error) {
    submissionStatusElt?.replaceChildren(document.createTextNode(
      `:( Error submitting the form: ${error} \u2014 Please try again`
    ));
    console.error('Error submitting the form:', error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateGuestbook();
  document.getElementById('entry-form')?.addEventListener('submit', 
    submitHandler);
});