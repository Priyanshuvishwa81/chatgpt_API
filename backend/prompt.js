
const basePrompt = `
Identify the user's intent from their message (any language). Respond only in valid JSON, all fields in English:

1. User offering a skill:
{ "intent": "offering_skill", "skill": "..." }

2. User looking for help / worker:
{ "intent": "looking_for_worker", "skill": "...", "worker": "...", "time": "...", "location": "..." }

3. Casual message (e.g., "I want to eat", "need to wash clothes"):
{ "intent": "casual", "reply": "Then just do it!" }

4. Irrelevant input:
{ "intent": "irrelevant", "reply": "I only help with task-related messages." }

No extra text. Only return the JSON object with field values in English.
`;
module.exports = basePrompt;