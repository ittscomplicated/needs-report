import PageTemplateOne from '@/components/PageTemplateOne';
import CardSection from "@/components/CardSection"; 


export default function AboutPage() {
  const title = "About Us";
  const content = ""
    // "About the platform Everyone needs a little help sometimes. It’s difficult to figure out where to report those needs or who to report them to. The situation may be complicated, and not knowing what to do about it can add to the weight. The Needs Report is a tool which allows people to make a report regarding their community or personal needs. Needs will be stored within our system for tracking and displayed to the public through a map view; pinpoints will indicate where the need is reported from. We hope to construct a two-way road for those in need. The reports become public and members of the community can help, working on building a foundation of altruism among the users of the platform. /n The Needs Report will be an automated data collection platform allowing individuals to anonymously report community needs using text messages. Citizen reports will then be represented on interactive maps on a public website so that donors, NGOs and governments can reference the community opinion to better align development projects with community priorities.  /n /n Why We Built It The project was theorized to address a problem occurring in a Millennium Village.  Community members were explaining that the reason the development initiatives in their community had not been maintained by community members was that the initiatives were not addressing the priorities of the community.  The example was an agriculture initiative which had failed.  The community explained they were more concerned about their access to clean water, and the survival rate of  young children.  Communities are still talking about this issue.  Initiatives from governments and NGOs are often decided outside of the communities they serve.  How can initiatives better incorporate the local opinion? Creating a system where community opinion is directly linked to the decision of what issue to address first, puts the power into the hands of the community members rather than those in control of the interventions.  Maintaining it serves as a corruption prevention mechanism – to ensure policies are effective, and to ensure aid/donations are used where and as intended.  Allowing community members to report current priorities ensures the effectiveness of initiatives over time.  If addressed adequately, the same issue should not reappear as a priority need";
  const images = ['/images/team.jpg', '/images/mission.jpg'];
  

  return (
    <div>
    <PageTemplateOne title={title} content={content} images={images} 
  />
    {/* Cards Section */}
        <div class="pt-10">
          <CardSection />
        </div>
    </div>
  
  
);
}