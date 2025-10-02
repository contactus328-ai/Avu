// Just to find where the add buttons are
const fs = require('fs');
const content = fs.readFileSync('/components/AddEvent.tsx', 'utf-8');
const lines = content.split('\n');

// Find lines containing contact or add buttons
lines.forEach((line, index) => {
  if (line.includes('contact') || line.includes('++') || line.includes('Add') || line.includes('Users') || line.includes('Team')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});