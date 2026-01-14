/**
 * Format time elapsed as "Xh Ym Zs ago" format
 * @param {Date|string} startTime - The start time
 * @param {Date} currentTime - The current time (defaults to now)
 * @returns {string} Formatted time string like "1h 2m 32s ago"
 */
export const formatTimeElapsed = (startTime, currentTime = new Date()) => {
  if (!startTime) return null;
  
  const start = new Date(startTime);
  const diff = Math.floor((currentTime - start) / 1000); // difference in seconds
  
  if (diff < 0) return '0s ago';
  
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return `${parts.join(' ')} ago`;
};

/**
 * Format time as "HH:MM am/pm" (no seconds, lowercase am/pm)
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted time string like "2:30 pm"
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Format date and time together
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted string like "Jan 8, 2024 • 2:30 pm"
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = formatTime(date);
  
  return `${dateStr} • ${timeStr}`;
};

export default {
  formatTimeElapsed,
  formatTime,
  formatDateTime
};

