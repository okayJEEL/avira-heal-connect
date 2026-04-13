import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, MessageCircle, Bell, Megaphone } from "lucide-react";
import ContactInbox from "./ContactInbox";
import StaffChat from "./StaffChat";
import PatientNotifications from "./PatientNotifications";
import AnnouncementsBoard from "./AnnouncementsBoard";

interface Props {
  isAdmin: boolean;
}

const MessagesHub = ({ isAdmin }: Props) => {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Inbox className="w-4 h-4" />
            <span className="hidden sm:inline">Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Staff Chat</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Announcements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <ContactInbox />
        </TabsContent>
        <TabsContent value="chat">
          <StaffChat />
        </TabsContent>
        <TabsContent value="notifications">
          <PatientNotifications />
        </TabsContent>
        <TabsContent value="announcements">
          <AnnouncementsBoard isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesHub;
