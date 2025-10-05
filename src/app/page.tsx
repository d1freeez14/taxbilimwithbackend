import LandingMain from "@/components/LandingComponents/LandingMain";
import LandingAdvantages from "@/components/LandingComponents/LandingAdvantages";
import LandingAboutUs from "@/components/LandingComponents/LandingAboutUs";
import LandingAdv from "@/components/LandingComponents/LandingAdv";
import LandingQuestions from "@/components/LandingComponents/LandingQuestions";
import LandingBlog from "@/components/LandingComponents/LandingBlog";
import LandingContacts from "@/components/LandingComponents/LandingContacts";
import LandingFooter from "@/components/LandingComponents/LandingFooter";

export default function HomePage() {
  return (
    <div className={'w-full h-full overflow-y-scroll flex flex-col bg-white'}>
      <LandingMain/>
      <LandingAboutUs/>
      <LandingAdvantages/>
      <LandingAdv/>
      <LandingQuestions/>
      <LandingBlog/>
      <LandingContacts/>
      <LandingFooter/>
    </div>
  );
}
