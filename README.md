# 📚 Real-Time Collaborative Study Platform

## 🧠 Overview
The **Real-Time Collaborative Study Platform** enables students to collaborate effectively in virtual rooms — sharing notes, participating in quizzes, communicating via voice calls, and working together on whiteboards.  
Each **room** acts as a collaborative space where members can upload resources, interact, and learn together.

The `room/[id]` page serves as the **core hub** of collaboration, bringing together all key features.

---

## 🚀 Features in Room

### 🧍‍♂️ Member Management
- 👥 **Members** — View all current members of the room.  
- ✉️ **Invite Members** — Send invitations for others to join the room.

---

### 📄 File & Content Management
- 📝 **Upload Notes** — Upload study materials and notes.  
- 📚 **Uploaded Notes** — View all uploaded notes within the room.  
- 🖼️ **Upload Image** — Upload relevant images or diagrams.  
- 🖼️ **Uploaded Images** — Browse uploaded images.  
- 🔗 **Add Links** — Add and share helpful external resources.  
- 🌐 **Links** — View and access uploaded links.  
- 🗒️ **Short Notes** — Quick summarized notes for revision.

---

### 🎙️ Interaction & Collaboration
- 🔊 **Voice Call** — Real-time voice communication for live discussions.  
- 🧑‍🏫 **Whiteboard** — A collaborative whiteboard for brainstorming and problem-solving.  
- 📢 **Announcements** — View announcements shared in the room.  
- 🗣️ **Announce To Room** — Post announcements for all members.

---

### 🧩 Assessment & Gamification
- 🧮 **Generate Quiz** — Create quizzes for members to attempt.  
- 🧠 **Attempt Quiz** — Take quizzes within the room.  
- 🏆 **Leaderboard** — View top performers and room scores.

---

## ⚙️ Component Mapping

All room features are dynamically rendered using the following map:

```javascript
const componentsMap = {
  "Members": <Members roomId={id} />,
  "Upload Notes": <UploadNotes roomId={id} />,
  "Invite Members": <InviteMembers roomId={id} />,
  "Voice Call": <VoiceChannel roomId={id} userId={userId} />,
  "Add Links": <UploadLink roomId={id} />,
  "Upload Image": <UploadImage roomId={id} />,
  "Uploaded Notes": <UploadedNotes roomId={id} />,
  "Links": <UploadedLinks roomId={id} />,
  "Uploaded Images": <UploadedImages roomId={id} />,
  "Short Notes": <ShortNotes roomId={id} />,
  "Generate Quiz": <QuizGenerator roomId={id} />,
  "Attempt Quiz": <AttemptQuiz roomId={id} />,
  "Leaderboard": <LeaderboardPageDummy roomId={id} />,
  "Whiteboard": <Whiteboard roomId={id} />,
  "Announcements": <AnnouncementsPage roomId={id} />,
  "Announce To Room": <UploadAnnouncement roomId={id} />,
};
