// contacts.ts
import { runAppleScript } from "@raycast/utils";

interface Contact {
  name: string;
  phone: string;
}

export async function getContacts(): Promise<Contact[]> {
  const result = await runAppleScript(
    `
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
  `,
    { timeout: 100000 },
  );
  console.log("getContacts result:", result);
  return result
    .split("\n")
    .filter((line: string) => line.trim() !== "" && !line.includes("No Phone"))
    .map((line: string) => {
      const [name, phone] = line.split("|").map((s: string) => s.trim());
      return { name, phone };
    });
}
