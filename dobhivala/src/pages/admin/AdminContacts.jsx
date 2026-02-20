import React, { useEffect, useState } from "react";
import { Mail, Phone, User, CheckCircle, Loader2 } from "lucide-react";
import {
  getAdminContactsApi,
  replyToContactApi,
  updateContactStatusApi,
} from "../../lib/backendApi";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    const result = await getAdminContactsApi();
    if (result.success) {
      setContacts(result.data?.contacts || []);
    } else {
      setError(result.message || "Failed to fetch contacts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onMarkResolved = async (contactId) => {
    setActionLoadingId(contactId);
    const result = await updateContactStatusApi(contactId, "resolved");
    if (!result.success) {
      setError(result.message || "Failed to update status");
      setActionLoadingId("");
      return;
    }
    setContacts((prev) =>
      prev.map((x) => (x._id === contactId ? { ...x, status: "resolved" } : x))
    );
    setActionLoadingId("");
  };

  const onReply = async (contact) => {
    const replyMessage = window.prompt(`Reply for ${contact.name}:`);
    if (!replyMessage || !replyMessage.trim()) return;

    setActionLoadingId(contact._id);
    const result = await replyToContactApi(contact._id, replyMessage.trim());
    if (!result.success) {
      setError(result.message || "Failed to send reply");
      setActionLoadingId("");
      return;
    }

    setContacts((prev) =>
      prev.map((x) =>
        x._id === contact._id
          ? {
              ...x,
              status: result.data?.contact?.status || "resolved",
              adminReply: result.data?.contact?.adminReply || replyMessage.trim(),
              repliedAt: result.data?.contact?.repliedAt || new Date().toISOString(),
            }
          : x
      )
    );
    setActionLoadingId("");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Contact Requests</h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-semibold">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="text-gray-500 text-center">No contact requests found.</div>
      ) : (
        <div className="space-y-5">
          {contacts.map((c) => (
            <div key={c._id} className="bg-white border border-blue-100 rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-700">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">{c.phone}</span>
                  </div>
                )}
                <div className="mt-2 text-gray-800">{c.message}</div>
                {c.adminReply ? (
                  <div className="mt-2 text-sm bg-green-50 border border-green-200 text-green-800 p-2 rounded-md">
                    <b>Reply:</b> {c.adminReply}
                  </div>
                ) : null}
                <div className="mt-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "new" ? "bg-blue-100 text-blue-700" : c.status === "resolved" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{c.status}</span>
                <button
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-60"
                  onClick={() => onReply(c)}
                  disabled={actionLoadingId === c._id}
                >
                  Reply User
                </button>
                {c.status !== "resolved" && (
                  <button
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-60"
                    onClick={() => onMarkResolved(c._id)}
                    disabled={actionLoadingId === c._id}
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
