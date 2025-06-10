// contacts.js
import { runAppleScript } from "run-applescript";

interface Contact {
  name: string;
  phone: string;
}

async function getContacts(): Promise<string> {
  const result = await runAppleScript(`
    tell application "Contacts"
        set theContacts to every person
        set contactList to ""
        repeat with aContact in theContacts
            set contactName to name of aContact
            try
                set contactPhone to value of first phone of aContact
            on error
                set contactPhone to "No Phone"
            end try
            set contactList to contactList & contactName & " | " & contactPhone & linefeed
        end repeat
        return contactList
    end tell
  `);
  return result;
}

async function parseContacts(): Promise<Contact[]> {
  const result = await getContacts();
  console.log(result);
  return result
    .split("\n")
    .filter((line: string) => line.trim() !== "")
    .map((line: string) => {
      const [name, phone] = line.split("|").map((s: string) => s.trim());
      return { name, phone };
      });
  }

export { getContacts, parseContacts };