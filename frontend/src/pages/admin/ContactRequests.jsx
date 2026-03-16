import { useState } from 'react';
import { Mail, MailOpen, ChevronDown, ChevronUp, Clock, User, Filter } from 'lucide-react';
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AppDropdown from "../../components/AppDropdown";
import { ContactRequestsDataSkeleton } from "../../components/skeletons";
import { waitForLoader } from "../../helpers/loaderDelay";

const ContactRequests = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        setIsLoading(true);

        await waitForLoader();

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/api/admin/util/contact-us`,

          { withCredentials: true }
        );

        if (res.data.success === true) {
          const formattedRequests = res.data.contacts.map((item) => ({
            id: item._id,
            name: item.name,
            email: item.email,
            subject: item.subject,
            message: item.message,
            submittedAt: item.createdAt,
            isRead: item.isRead,
          }));

          setRequests(formattedRequests);
        } else {
          toast.error(res.data.message || "Failed to fetch contact requests");
        }

      } catch (error) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to load contact requests";

        toast.error(backendMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessagePreview = (message, maxLength = 80) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + '...';
  };

  const markAsRead = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URI}/api/admin/util/contact-us/${id}/read`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setRequests(prev =>
          prev.map(req =>
            req.id === id ? { ...req, isRead: true } : req
          )
        );

        toast.success(res.data.message || "Marked as read");
      } else {
        toast.error(res.data.message || "Failed to mark as read");
      }

    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to mark request as read";

      toast.error(backendMessage);
    }
  };


  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRequests = requests
    .filter(req => {
      if (filter === 'read') return req.isRead;
      if (filter === 'unread') return !req.isRead;
      return true;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const unreadCount = requests.filter(r => !r.isRead).length;



  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contact Requests</h1>
        <p className="text-slate-600 mt-1">View and manage contact form submissions</p>
      </div>

      {/* Stats & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-600" />
              <span className="text-sm text-slate-600">
                Total: <span className="font-semibold text-slate-800">{requests.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-sm text-slate-600">
                Unread: <span className="font-semibold text-slate-800">{unreadCount}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <AppDropdown
              options={[
                { value: "all", label: "All Requests" },
                { value: "unread", label: "Unread Only" },
                { value: "read", label: "Read Only" },
              ]}
              value={filter}
              onChange={(val) => setFilter(val)}
              placeholder="All Requests"
              size="sm"
            />

          </div>
        </div>
      </div>

      {/* Request Cards */}
      {isLoading ? (
  <ContactRequestsDataSkeleton count={5} />
) : (
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <MailOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No contact requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-xl shadow-sm border transition-all ${request.isRead
                ? 'border-slate-200'
                : 'border-l-4 border-l-amber-500 border-slate-200'
                }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Read/Unread Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${request.isRead ? 'bg-slate-100' : 'bg-amber-50'
                      }`}>
                      {request.isRead ? (
                        <MailOpen className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-amber-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold ${request.isRead ? 'text-slate-700' : 'text-slate-800'
                          }`}>
                          {request.subject}
                        </h3>
                        {!request.isRead && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{request.name}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span>{request.email}</span>
                      </div>

                      {expandedId !== request.id && (
                        <p className="mt-2 text-sm text-slate-600">
                          {getMessagePreview(request.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(request.submittedAt)}</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === request.id && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2">Full Message:</p>
                    <p className="text-slate-600 whitespace-pre-wrap">{request.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => toggleExpand(request.id)}
                    className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
                  >
                    {expandedId === request.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>

                  {!request.isRead && (
                    <button
                      onClick={() => markAsRead(request.id)}
                      className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
                    >
                      <MailOpen className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>)}
    </div>
  );
};

export default ContactRequests;
