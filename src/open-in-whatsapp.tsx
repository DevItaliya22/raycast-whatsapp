import { ActionPanel, Action, List, showToast, Toast, open, Icon } from "@raycast/api";
import { useLocalStorage, useFrecencySorting } from "@raycast/utils";
import { getContacts } from "./contact";
import React, { useEffect, useState } from "react";

interface Contact {
  name: string;
  phone: string;
}

export default function Command() {
  const {
    value: contacts,
    setValue: setContacts,
    isLoading: isLoadingStorage,
  } = useLocalStorage<Contact[]>("contacts", []);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);

  const { data: frecentContacts, visitItem } = useFrecencySorting(contacts || [], {
    key: (contact) => contact.phone,
    namespace: "whatsapp-contacts",
  });

  const sortedContacts = React.useMemo(() => {
    return [...(contacts || [])].sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  async function refresh() {
    setIsLoadingFetch(true);
    await showToast({ style: Toast.Style.Animated, title: "Refreshing contacts..." });
    try {
      const freshContacts = await getContacts();
      await setContacts(freshContacts);
      await showToast({ style: Toast.Style.Success, title: "Contacts refreshed" });
    } catch (error) {
      console.error(error);
      await showToast({ style: Toast.Style.Failure, title: "Failed to refresh contacts" });
    } finally {
      setIsLoadingFetch(false);
    }
  }

  useEffect(() => {
    if (!contacts || contacts.length === 0) {
      refresh();
    }
  }, []);

  const frequentlyUsedContacts = frecentContacts.slice(0, 5);

  return (
    <List isLoading={isLoadingStorage || isLoadingFetch} searchBarPlaceholder="Search WhatsApp contact...">
      <List.Section title="Frequently Used" key="frequent-section">
        {frequentlyUsedContacts.map((contact, index) => (
          <List.Item
            key={contact.phone + contact.name + index + "-frequent"}
            title={contact.name}
            subtitle={contact.phone}
            actions={
              <ActionPanel>
                <Action
                  title="Open In WhatsApp"
                  icon={Icon.Message}
                  onAction={() => {
                    visitItem(contact);
                    open(`whatsapp://send?phone=${contact.phone.replace(/\\D/g, "")}`);
                  }}
                />
                <Action title="Refresh Contacts" icon={Icon.ArrowClockwise} onAction={refresh} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      <List.Section title="All Contacts" key="all-contacts-section">
        {sortedContacts.map((contact, index) => (
          <List.Item
            key={contact.phone + contact.name + index}
            title={contact.name}
            subtitle={contact.phone}
            actions={
              <ActionPanel>
                <Action
                  title="Open In WhatsApp"
                  icon={Icon.Message}
                  onAction={() => {
                    visitItem(contact);
                    open(`whatsapp://send?phone=${contact.phone.replace(/\\D/g, "")}`);
                  }}
                />
                <Action title="Refresh Contacts" icon={Icon.ArrowClockwise} onAction={refresh} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
