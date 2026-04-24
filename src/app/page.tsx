import HomeExperience from "@/components/HomeExperience";
import { getAllProjects, getCurrentDay } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const all = getAllProjects();
  const day = getCurrentDay();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.author,
    url: SITE.url,
    sameAs: [
      SITE.social.twitter,
      SITE.social.tiktok,
      SITE.social.youtube,
      SITE.social.instagram,
    ],
    description: SITE.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience day={day} total={all.length} projects={all} />
    </>
  );
}
