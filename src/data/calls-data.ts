export const recentCalls = [
  { name: "John Smith", time: "Today, 2:30 PM", type: "incoming" },
  { name: "Sarah Johnson", time: "Today, 11:45 AM", type: "outgoing" },
  { name: "Unknown", time: "Yesterday, 8:15 PM", type: "missed" },
  { name: "Mom", time: "Yesterday, 5:20 PM", type: "incoming" },
];

// Generate call logs for a contact
export function generateCallLogs() {
  const today = "Today";
  const yesterday = "Yesterday";
  const twoDaysAgo = "2 days ago";

  // Generate random call logs
  const logs = [
    // Today
    {
      date: today,
      time: "4:45 PM",
      duration: "2:34",
      type: "incoming",
      note: null,
    },
    {
      date: today,
      time: "2:30 PM",
      duration: "0:48",
      type: "incoming",
      note: null,
    },
    {
      date: today,
      time: "11:20 AM",
      duration: "1:15",
      type: "outgoing",
      note: null,
    },
    // Yesterday
    {
      date: yesterday,
      time: "7:15 PM",
      duration: "0:00",
      type: "missed",
      note: "While on another call",
    },
    {
      date: yesterday,
      time: "3:45 PM",
      duration: "5:22",
      type: "outgoing",
      note: null,
    },
    {
      date: yesterday,
      time: "10:30 AM",
      duration: "1:05",
      type: "incoming",
      note: null,
    },
    // 2 days ago
    {
      date: twoDaysAgo,
      time: "8:20 PM",
      duration: "0:00",
      type: "missed",
      note: null,
    },
    {
      date: twoDaysAgo,
      time: "4:15 PM",
      duration: "3:12",
      type: "outgoing",
      note: "Conference call",
    },
    {
      date: twoDaysAgo,
      time: "11:50 AM",
      duration: "0:37",
      type: "incoming",
      note: null,
    },
    {
      date: twoDaysAgo,
      time: "9:25 AM",
      duration: "2:18",
      type: "outgoing",
      note: null,
    },
  ];

  return logs;
}

// Generate all call logs for filtering
export function generateAllCallLogs() {
  const today = "Today";
  const yesterday = "Yesterday";
  const twoDaysAgo = "2 days ago";

  // Generate random call logs with contact names
  const logs = [
    // Today
    {
      date: today,
      time: "4:45 PM",
      duration: "2:34",
      type: "incoming",
      note: null,
      contact: "John Smith",
    },
    {
      date: today,
      time: "3:12 PM",
      duration: "0:48",
      type: "outgoing",
      note: null,
      contact: "Pizza Delivery",
    },
    {
      date: today,
      time: "2:30 PM",
      duration: "0:48",
      type: "incoming",
      note: null,
      contact: "John Smith",
    },
    {
      date: today,
      time: "1:15 PM",
      duration: "0:00",
      type: "missed",
      note: null,
      contact: "Unknown",
    },
    {
      date: today,
      time: "11:20 AM",
      duration: "1:15",
      type: "outgoing",
      note: null,
      contact: "John Smith",
    },
    // Yesterday
    {
      date: yesterday,
      time: "8:15 PM",
      duration: "0:00",
      type: "missed",
      note: null,
      contact: "Unknown",
    },
    {
      date: yesterday,
      time: "7:15 PM",
      duration: "0:00",
      type: "missed",
      note: "While on another call",
      contact: "Sarah Johnson",
    },
    {
      date: yesterday,
      time: "5:20 PM",
      duration: "3:45",
      type: "incoming",
      note: null,
      contact: "Mom",
    },
    {
      date: yesterday,
      time: "3:45 PM",
      duration: "5:22",
      type: "outgoing",
      note: null,
      contact: "Sarah Johnson",
    },
    {
      date: yesterday,
      time: "10:30 AM",
      duration: "1:05",
      type: "incoming",
      note: null,
      contact: "Sarah Johnson",
    },
    // 2 days ago
    {
      date: twoDaysAgo,
      time: "8:20 PM",
      duration: "0:00",
      type: "missed",
      note: null,
      contact: "Sarah Johnson",
    },
    {
      date: twoDaysAgo,
      time: "4:15 PM",
      duration: "3:12",
      type: "outgoing",
      note: "Conference call",
      contact: "Sarah Johnson",
    },
    {
      date: twoDaysAgo,
      time: "11:50 AM",
      duration: "0:37",
      type: "incoming",
      note: null,
      contact: "Office",
    },
    {
      date: twoDaysAgo,
      time: "9:25 AM",
      duration: "2:18",
      type: "outgoing",
      note: null,
      contact: "Sarah Johnson",
    },
  ];

  return logs;
}
