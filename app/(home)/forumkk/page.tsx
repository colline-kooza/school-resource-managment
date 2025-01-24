import Announcements from "@/components/forum/annoucement";
import DiscussionThreads from "@/components/forum/discussion-threads";
import ForumLayout from "@/components/forum/forum-layer";
import TopicCategories from "@/components/forum/topic-category";
import TrendingTopics from "@/components/forum/trending-topics";


export default function page() {
  return (
    <ForumLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Announcements/>
          <DiscussionThreads/>
        </div>
        <div className="space-y-6">
          <TopicCategories/>
          <TrendingTopics/>
        </div>
      </div>
    </ForumLayout>
  )
}

