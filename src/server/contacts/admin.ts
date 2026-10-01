import "server-only";

import { contactMessagesCollection } from "../db";
import { withId, type ContactMessageStatus } from "../db/schema";

export async function listContactMessages() {
  const docs = await contactMessagesCollection()
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(withId);
}

export async function countNewContactMessages() {
  return contactMessagesCollection().countDocuments({ status: "new" });
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus
) {
  await contactMessagesCollection().updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } }
  );
}

export async function deleteContactMessage(id: string) {
  await contactMessagesCollection().deleteOne({ _id: id });
}
