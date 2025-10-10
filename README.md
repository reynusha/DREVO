
DREVO Messenger Demo (React + Vite)
----------------------------------

This is a local demo app imitating a messenger UI (Feed, Profile, Chats, Shop) with:
- Simulated Telegram Mini App auth (localStorage)
- Feed where users can create posts (stored in localStorage and synced across tabs/windows)
- Profile editor (change avatar initial, name, username, bio)
- Chats simulated with BroadcastChannel for multi-tab messaging and presence
- Shop placeholder

How to run:
1. unzip the package
2. cd into project folder
3. npm install
4. npm run dev
5. open http://localhost:5173 (or the address Vite reports)

Notes:
- This is a **demo**. No server or real Telegram API is used.
- For multi-tab demo of chat and feed sync, open the app in two browser tabs.
- Username 'clanffys' gets a blue checkmark and "Owner" style display.

Enjoy!
