import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, MessageCircle, Megaphone } from "lucide-react";
import ContactInbox from "./ContactInbox";
import StaffChat from "./StaffChat";
import AnnouncementsBoard from "./AnnouncementsBoard";

interface Props {
  isAdmin: boolean;
}

const MessagesHub = ({ isAdmin }: Props) => {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox" className="flex items-center gap-1.5 text-[11px] sm:text-sm px-1.5">
            <Inbox className="w-4 h-4" />
            <span className="truncate">Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1.5 text-[11px] sm:text-sm px-1.5">
            <MessageCircle className="w-4 h-4" />
            <span className="truncate">Staff Chat</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-1.5 text-[11px] sm:text-sm px-1.5">
            <Megaphone className="w-4 h-4" />
            <span className="truncate">Announcements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <ContactInbox />
        </TabsContent>
        <TabsContent value="chat">
          <StaffChat />
        </TabsContent>
        <TabsContent value="announcements">
          <AnnouncementsBoard isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesHub;
