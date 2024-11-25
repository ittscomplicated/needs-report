import PageTemplateOne from '@/components/PageTemplateOne';


const HomePage = () => {
const title = "Home Page";
  const content =
    "We are NeedsReport, you can report your needs here.";
const images = ['/images/team.jpg', '/images/mission.jpg'];

  return <PageTemplateOne title={title} content={content} images={images} />;
};

export default HomePage;
