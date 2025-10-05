Project Management System
------------------------------------------------
Fields: projectTitle, clientName, deadline (date), status, notes, image

How to run:
1. unzip or open this folder in your terminal
2. run: npm install
3. run: npm start
4. open http://localhost:3500

Notes:
- Data is stored in memory (projects array). Restarting the server resets data.
- Uploaded images saved to /images with filename = <id>.<ext>.
- This is intentionally simple (no DB).
