// Utility functions for safe localStorage operations

export const saveToLocalStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    
    // Try to parse as JSON
    const parsed = JSON.parse(saved);
    return parsed;
  } catch (error) {
    // For backward compatibility, if JSON parse fails, 
    // check if it's a valid string value
    const saved = localStorage.getItem(key);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      // For string values like email addresses
      if (typeof defaultValue === 'string') {
        return saved as T;
      }
    }
    
    console.warn(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const clearLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error);
    return false;
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  USER_EVENTS: 'zhevents_user_events',
  PROFILE_EMAIL: 'zhevents_profile_email',
  SENT_EMAILS: 'zhevents_sent_emails',
  REGISTERED_EVENTS: 'zhevents_registered_events'
} as const;