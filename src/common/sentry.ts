import * as Sentry from "@sentry/electron";
export const init = () => {
  Sentry.init({ dsn: "https://b88a9a79cf719f1fb6b8e91afaf665cc@o4506908935258112.ingest.us.sentry.io/4506908937420800" });
}
