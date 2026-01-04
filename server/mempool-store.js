const MAX_EVENTS = 1000;
const events = [];

export function recordMempoolEvent(evt) {
  events.push(evt);
  if (events.length > MAX_EVENTS) {
    events.shift();
  }
}

export function getRecentEvents() {
  return events.slice().reverse();
}
