import React, { useState, useMemo } from 'react';
import type { Screen } from '../App';

interface HomeProps {
  navigate: (screen: Screen, eventId?: string) => void;
  events: any[];
  userProfile: {
    name: string;
    email: string;
    phone: string;
    isProfileComplete: boolean;
  };
}

/* ========= Date helpers (locale-aware) ========= */
function fmtDate(d: string | Date) {
  try {
    return new Date(d).toLocaleDateString(navigator.language || "en-US", {
      day: "numeric",
      month: "short", 
      year: "numeric"
    });
  } catch {
    return new Date(d).toDateString();
  }
}

function formatFriendlyRangeLocale(startISO: string, endISO?: string) {
  const s = new Date(startISO);
  const e = new Date(endISO || startISO);
  
  if (s.toDateString() === e.toDateString()) return fmtDate(s);
  
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    const startDay = s.toLocaleDateString(navigator.language || "en-US", { day: "numeric" });
    const monthYear = s.toLocaleDateString(navigator.language || "en-US", { month: "short", year: "numeric" });
    const endDay = e.toLocaleDateString(navigator.language || "en-US", { day: "numeric" });
    return `${startDay}–${endDay} ${monthYear}`;
  }
  
  if (s.getFullYear() === e.getFullYear()) {
    const startMY = s.toLocaleDateString(navigator.language || "en-US", { day: "numeric", month: "short" });
    const endMY = e.toLocaleDateString(navigator.language || "en-US", { day: "numeric", month: "short", year: "numeric" });
    return `${startMY} – ${endMY}`;
  }
  
  return `${fmtDate(s)} – ${fmtDate(e)}`;
}

/* ========= Fuzzy text + natural date parsing ========= */
function editDistance(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost);
    }
  }
  return dp[m][n];
}

// Enhanced similarity scoring for better fuzzy matching
function calculateSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  
  // Exact match
  if (a === b) return 1;
  
  // Contains match (higher priority)
  if (a.includes(b) || b.includes(a)) return 0.9;
  
  // Edit distance similarity
  const distance = editDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  const similarity = (maxLength - distance) / maxLength;
  
  // Boost similarity for shorter strings with small differences
  if (maxLength <= 6 && distance <= 2) return Math.max(0.7, similarity);
  if (maxLength <= 10 && distance <= 3) return Math.max(0.6, similarity);
  
  return similarity;
}

// Enhanced word matching with better fuzzy logic
function tokenMatchesWord(token: string, word: string): boolean {
  if (!token || !word) return false;
  
  token = token.toLowerCase().trim();
  word = word.toLowerCase().trim();
  
  // Exact match
  if (word === token) return true;
  
  // Contains match
  if (word.includes(token) || token.includes(word)) return true;
  
  // Enhanced fuzzy matching with adaptive thresholds
  const similarity = calculateSimilarity(token, word);
  
  // Adaptive threshold based on token length
  let threshold = 0.5;
  if (token.length <= 3) threshold = 0.6;      // Stricter for very short words
  else if (token.length <= 5) threshold = 0.55; // Moderate for short words
  else if (token.length <= 8) threshold = 0.5;  // Standard for medium words
  else threshold = 0.45;                        // More lenient for long words
  
  return similarity >= threshold;
}

// Enhanced phrase matching for multi-word searches
function tokenMatchesPhrase(token: string, phrase: string): boolean {
  if (!token || !phrase) return false;
  
  const cleanPhrase = phrase.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();
  
  // Direct substring match
  if (cleanPhrase.includes(cleanToken)) return true;
  
  // Split phrase into words and check each
  const words = cleanPhrase.split(/[^a-z0-9]+/).filter(Boolean);
  return words.some(word => tokenMatchesWord(cleanToken, word));
}

// Enhanced haystack search with better field weighting
function tokenMatchesHaystack(token: string, haystack: string): boolean {
  if (!token || !haystack) return false;
  
  const cleanHaystack = haystack.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();
  
  // Direct substring match (highest priority)
  if (cleanHaystack.includes(cleanToken)) return true;
  
  // Word-level fuzzy matching
  const words = cleanHaystack.split(/[^a-z0-9]+/).filter(Boolean);
  return words.some(word => tokenMatchesWord(cleanToken, word));
}

// Enhanced multi-field search with relevance scoring
function searchInFields(token: string, event: any): { matches: boolean; relevance: number } {
  const fields = [
    { value: event.college, weight: 1.2 },      // College name - high priority
    { value: event.event, weight: 1.2 },       // Event name - high priority  
    { value: event.city, weight: 1.0 },        // City - medium priority
    { value: event.type, weight: 0.9 },        // Event type - medium priority
    { value: event.comp, weight: 0.8 },        // Competition type - lower priority
  ];
  
  // Include sub-event data
  if (event.subEvents && Array.isArray(event.subEvents)) {
    event.subEvents.forEach((subEvent: any) => {
      if (subEvent.type) fields.push({ value: subEvent.type, weight: 0.7 });
      if (subEvent.name) fields.push({ value: subEvent.name, weight: 0.7 });
    });
  }
  
  let bestRelevance = 0;
  let hasMatch = false;
  
  for (const field of fields) {
    if (!field.value) continue;
    
    const fieldValue = String(field.value).toLowerCase().trim();
    const cleanToken = token.toLowerCase().trim();
    
    // Check for exact match
    if (fieldValue === cleanToken) {
      hasMatch = true;
      bestRelevance = Math.max(bestRelevance, 1.0 * field.weight);
      continue;
    }
    
    // Check for contains match
    if (fieldValue.includes(cleanToken)) {
      hasMatch = true;
      bestRelevance = Math.max(bestRelevance, 0.9 * field.weight);
      continue;
    }
    
    // Check for fuzzy match in individual words
    const words = fieldValue.split(/[^a-z0-9]+/).filter(Boolean);
    for (const word of words) {
      const similarity = calculateSimilarity(cleanToken, word);
      
      let threshold = 0.5;
      if (cleanToken.length <= 3) threshold = 0.6;
      else if (cleanToken.length <= 5) threshold = 0.55;
      else if (cleanToken.length <= 8) threshold = 0.5;
      else threshold = 0.45;
      
      if (similarity >= threshold) {
        hasMatch = true;
        bestRelevance = Math.max(bestRelevance, similarity * field.weight);
      }
    }
  }
  
  return { matches: hasMatch, relevance: bestRelevance };
}

function parseDDMMYY(tok: string) {
  const m = tok.match(/^(\d{1,2})(?:st|nd|rd|th)?\/(\d{1,2})\/(\d{2}|\d{4})$/i);
  if (m) {
    let d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
    if (y < 100) {
      y = y <= 79 ? 2000 + y : 1900 + y;
    }
    return new Date(y, mo-1, d);
  }
  // natural forms like "25th Nov", "Nov 25", "25 Nov 2025"
  const natural = tok.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const dt = Date.parse(natural);
  if (!isNaN(dt)) return new Date(dt);
  return null;
}

function dateInRange(d: Date, start: string, end?: string) {
  const t = d.setHours(0,0,0,0);
  const s = new Date(start).setHours(0,0,0,0);
  const e = new Date(end || start).setHours(0,0,0,0);
  return t >= s && t <= e;
}

// Convert existing events data to match the expected format
function convertEventData(events: any[]) {
  return events.map(event => ({
    college: event.college,
    event: event.eventName,
    city: event.location,
    start: convertDateToISO(event.dates),
    end: convertDateToISO(event.dates, true),
    type: event.type,
    comp: event.competition,
    id: event.id,
    createdAt: event.createdAt || 0,
    subEvents: event.events || [] // Include sub-events for search
  }));
}

// Helper function to convert date strings to ISO format
function convertDateToISO(dateStr: string, isEnd = false): string {
  // Handle formats like "25th to 26th Nov 25", "24th to 24th May 25"
  const rangeMatch = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+to\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{2})/);
  if (rangeMatch) {
    const [, startDay, endDay, month, year] = rangeMatch;
    const fullYear = parseInt(year) + 2000;
    const monthNum = getMonthNumber(month);
    const day = isEnd ? parseInt(endDay) : parseInt(startDay);
    return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  // Handle single date formats like "25th Nov 25", "24th Dec 25"
  const singleMatch = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{2})/);
  if (singleMatch) {
    const [, day, month, year] = singleMatch;
    const fullYear = parseInt(year) + 2000;
    const monthNum = getMonthNumber(month);
    return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${parseInt(day).toString().padStart(2, '0')}`;
  }
  
  // Fallback for other formats - use current date
  return '2025-01-01';
}

function getMonthNumber(monthStr: string): number {
  const months = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
  };
  return months[monthStr.toLowerCase() as keyof typeof months] || 1;
}

/* ========= Layout components ========= */
const ROW_GRID = "grid grid-cols-[1fr_124px] items-start gap-3";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-[360px] h-[100dvh] mx-auto bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
    {children}
  </div>
);

function TopBar({ navigate, userProfile }: { 
  navigate: (screen: Screen) => void;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    isProfileComplete: boolean;
  };
}) {
  const displayName = userProfile.name || 'User';
  
  return (
    <div className="h-14 bg-neutral-100/80 border-b backdrop-blur flex items-center px-4 justify-end shrink-0">
      <button 
        className="px-3 py-1.5 border rounded-lg bg-white hover:bg-neutral-50 transition-transform duration-75 active:scale-95" 
        aria-label={`${displayName} Menu`}
        onClick={() => navigate('org_dashboard')}
      >
        {displayName}
      </button>
    </div>
  );
}

function SearchBarFixed({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <div className="shrink-0 bg-white border-b">
      <div className="px-4 py-2">
        <div className="h-10 w-full rounded-xl border bg-white flex items-center gap-2 px-2 text-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search: College / Event / City / Type or date" 
            className="flex-1 outline-none placeholder:text-neutral-400" 
            aria-label="Search events" 
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              className="px-2 py-1 border rounded-md hover:bg-neutral-50" 
              title="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="shrink-0 border-b border-t bg-white">
      <div className="w-full max-w-full mx-auto px-3 py-3">
        <div className={ROW_GRID}>
          <div className="min-w-0">
            <div className="leading-5">College Name</div>
            <div className="leading-5">Event Name</div>
            <div className="leading-5 text-neutral-700">City, Locality</div>
          </div>
          <div className="text-right leading-5">
            <div>Event Dates</div>
            <div>Event Type</div>
            <div>Competition Type</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10 px-6">
      <div className="text-neutral-700">No events found</div>
      <div className="text-neutral-400 mt-1">Refine your search by another city, college, type, or date</div>
    </div>
  );
}

interface EventCardProps {
  data: {
    college: string;
    event: string;
    city: string;
    start: string;
    end: string;
    type: string;
    comp: string;
    id: string;
    category?: 'current' | 'upcoming' | 'past';
    subEvents?: any[];
  };
  onClick: () => void;
}

function EventCard({ data, onClick }: EventCardProps) {
  const friendlyDates = formatFriendlyRangeLocale(data.start, data.end);
  
  return (
    <div 
      className="w-full max-w-full mx-auto block text-left px-3 py-3 rounded-xl border shadow-sm bg-white cursor-pointer transition-transform duration-75 active:scale-95"
      onClick={onClick}
    >
      <div className={ROW_GRID}>
        <div className="min-w-0">
          <div className="leading-5">{data.college}</div>
          <div className="leading-5 whitespace-pre-line">{data.event}</div>
          <div className="leading-5 text-neutral-700">{data.city}</div>
        </div>
        <div className="text-right leading-5 whitespace-pre-line">
          <div>{friendlyDates}</div>
          <div>{data.type}</div>
          {data.comp && <div>{data.comp}</div>}
        </div>
      </div>
    </div>
  );
}

function HomeList({ query, navigate, events }: { query: string; navigate: (screen: Screen, eventId?: string) => void; events: any[] }) {
  const baseEvents = convertEventData(events);
  
  // Use the base events directly without duplication
  let allEvents = baseEvents.map((event, idx) => ({
    ...event,
    key: `event-${idx}`
  }));

  // Filter out events that ended more than 7 days ago
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredEvents = allEvents.filter(event => {
    const eventEndDate = new Date(event.end);
    eventEndDate.setHours(23, 59, 59, 999); // Set to end of day
    return eventEndDate >= sevenDaysAgo;
  });

  // Categorize and sort events by priority
  const categorizedEvents = filteredEvents.map(event => {
    const eventStartDate = new Date(event.start);
    const eventEndDate = new Date(event.end);
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(23, 59, 59, 999);
    
    let category: 'current' | 'upcoming' | 'past';
    let sortKey: number;
    
    if (today >= eventStartDate && today <= eventEndDate) {
      // Current/Ongoing events (happening today or multi-day events that include today)
      category = 'current';
      sortKey = eventStartDate.getTime(); // Earlier start dates rank higher
    } else if (today < eventStartDate) {
      // Upcoming events
      category = 'upcoming';
      sortKey = eventStartDate.getTime(); // Sooner events rank higher
    } else {
      // Past events (ended but within 7 days)
      category = 'past';
      sortKey = -eventEndDate.getTime(); // More recently ended rank higher (negative for reverse sort)
    }
    
    return {
      ...event,
      category,
      sortKey
    };
  });

  // Sort within each category
  const currentEvents = categorizedEvents
    .filter(e => e.category === 'current')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  const upcomingEvents = categorizedEvents
    .filter(e => e.category === 'upcoming')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  const pastEvents = categorizedEvents
    .filter(e => e.category === 'past')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  // Combine in priority order: Current -> Upcoming -> Past
  allEvents = [...currentEvents, ...upcomingEvents, ...pastEvents];

  const filtered = useMemo(() => {
    const q = (query || "").trim();
    if (!q) return allEvents;
    
    const tokens = q.split(/\s+/).filter(Boolean);
    
    // Simple and robust search logic
    return allEvents.filter((event) => {
      // Create a searchable text combining all event fields
      const searchText = [
        event.college,
        event.event, 
        event.city,
        event.type,
        event.comp,
        // Include sub-event data
        ...(event.subEvents || []).map((sub: any) => `${sub.name || ''} ${sub.type || ''}`),
        // Include date in searchable format
        formatFriendlyRangeLocale(event.start, event.end)
      ].join(' ').toLowerCase();
      
      // Check if all tokens match (fuzzy matching)
      return tokens.every(token => {
        const lowerToken = token.toLowerCase();
        
        // Direct substring match (fastest)
        if (searchText.includes(lowerToken)) {
          return true;
        }
        
        // Fuzzy matching for typos
        const words = searchText.split(/\s+/).filter(Boolean);
        return words.some(word => {
          // Exact match
          if (word === lowerToken) return true;
          
          // Contains match
          if (word.includes(lowerToken) || lowerToken.includes(word)) return true;
          
          // Fuzzy match for typos (simple edit distance)
          if (lowerToken.length >= 3 && word.length >= 3) {
            const similarity = calculateSimilarity(lowerToken, word);
            const threshold = lowerToken.length <= 4 ? 0.7 : 0.6;
            return similarity >= threshold;
          }
          
          return false;
        });
      });
    });
  }, [allEvents, query]);

  const handleEventClick = (eventId: string) => {
    // Check if it's one of the original hardcoded events
    const originalEvents = ['pandu', 'kaiso', 'maker', 'aitran', 'saman', 'sund'];
    if (originalEvents.includes(eventId)) {
      navigate(`detail_${eventId}` as Screen, eventId);
    } else {
      // For dynamically created events, use the general event_detail screen
      navigate('event_detail', eventId);
    }
  };

  return (
    <div className="pb-6">
      <div className="mt-2 space-y-2">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((e) => (
            <EventCard 
              key={e.key} 
              data={e} 
              onClick={() => handleEventClick(e.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function Home({ navigate, events, userProfile }: HomeProps) {
  const [query, setQuery] = useState("");

  return (
    <Frame>
      <TopBar navigate={navigate} userProfile={userProfile} />
      <SearchBarFixed query={query} setQuery={setQuery} />
      <HeaderBar />
      <div className="flex-1 overflow-y-auto overscroll-y-contain scrollbar-hide inertial-scroll-y">
        <HomeList query={query} navigate={navigate} events={events} />
      </div>
    </Frame>
  );
}