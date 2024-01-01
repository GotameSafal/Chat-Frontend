import Chatbody from "@components/Chatbody";
import Friendlist from "@components/Friendlist";
const page = () => {
  return (
    <div className="flex">
      <Friendlist />
      <Chatbody />
    </div>
  );
};

export default page;
