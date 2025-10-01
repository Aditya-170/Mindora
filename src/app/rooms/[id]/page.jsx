// src/app/rooms/[id]/page.jsx
import RoomFeaturesPage from "./RoomFeaturesPage";

export default function RoomPage({ params }) {
  return <RoomFeaturesPage roomId={params.id} />;
}
