import PageTemplateOne from '@/components/PageTemplateOne';

export default function AboutPage() {
  const title = "About Us";
  const content =
    "Welcome to the About Page. Here, you can find information about our mission, values, and the team behind our amazing platform.";
  const images = ['/images/team.jpg', '/images/mission.jpg'];

  return <PageTemplateOne title={title} content={content} images={images} />;
}