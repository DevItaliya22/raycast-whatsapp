import { ActionPanel, Action, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { parseContacts } from "./contact";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      console.log("Loading contacts..."); 
      const parsedContacts = await parseContacts();
      setContacts(parsedContacts);
      setIsLoading(false);
    }

    loadContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search WhatsApp contact..."
    >
      {filteredContacts.map((contact,index) => (
        <List.Item
          key={contact.phone + contact.name + index} // safer key in case of duplicate phone numbers
          title={contact.name}
          subtitle={contact.phone}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open in WhatsApp"
                url={`whatsapp://send?phone=${contact.phone.replace(/\D/g, "")}`} // strip non-digit chars
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
