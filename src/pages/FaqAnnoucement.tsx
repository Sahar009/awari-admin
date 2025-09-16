import { Edit2Icon, Minus, PencilLine, Plus, Trash } from "lucide-react";
import { useState } from "react";


export interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqAnnoucement = () => {
  const [open, setOpen] = useState(false);
  const [addFaq, setAddFaq] = useState(false)
  const [banners, setBanners] = useState([
    { id: 1, title: "Welcome Offer", status: "Active" },
    { id: 2, title: "Shortlet Discount", status: "Inactive" },
  ]);

  const faqData: FaqItemProps[] = [
    {
      question: "What services does Awari provide?",
      answer:
        "Awari provides real estate advisory, property management, and investment guidance to help you make informed property decisions.",
    },
    {
      question: "How experienced is the Awari team?",
      answer:
        "Our team has over 20 years of combined experience in real estate, offering trusted expertise and professional advice.",
    },
    {
      question: "Does Awari assist with property investment?",
      answer:
        "Yes, we guide you through every stage of the investment process, from market research to property acquisition.",
    },
    {
      question: "Can I book a consultation online?",
      answer:
        "Absolutely! You can schedule a consultation through our website or by contacting us directly via email or phone.",
    },
  ];

  return (
    <div className="p-6 flex gap-5 rounded-xl">
      <div className="w-[60%] bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">FAQs</h2>
          <button onClick={() => setAddFaq(!addFaq)}className="bg-purple-600 text-white px-2 py-2 rounded-full flex items-center gap-2">
            
                    {open ? (
                      <Minus size={22} />
                    ) : (
                      <Plus size={22}  />
                    )}
                 
          </button>
        </div>
   {addFaq &&
        <div className="my-6">
          <form className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="" className="text-sm font-normal italic">
                Question
              </label>
              <div className="w-full  py-3 rounded-xl border border-purple-400">
                <input
                  className="px-4 text-lg font-light w-full h-full outline-none"
                  type="text"
                  placeholder="Add new question"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="" className="text-sm font-normal italic">
                Answer
              </label>
              <div className="w-full  rounded-xl border border-purple-400">
                <textarea
                  className="w-full h-full outline-none border-none p-4 text-lg font-light resize-none"
                  rows={4}
                  name=""
                  id=""
                  placeholder="Add your answer here"
                ></textarea>
              </div>
            </div>

            <div>
              <button className="bg-purple-500 px-6 py-2 text-white  rounded-sm">Add FAQ</button>

            </div>
          </form>
        </div>
}
        <div className="flex flex-col gap-6">
          {faqData.map((data, index) => (
            <div
              key={index}
              className="w-full border-b border-gray-300 py-4 px-8 rounded-xl bg-purple-100 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-md"
            >
              {/* Header with Question & Icon */}
              <button className="w-full flex justify-between items-center text-left">
                <span className="font-semibold text-lg">{data.question}</span>
                <div className="flex items-center gap-2">
                  <PencilLine size={18} />
                 <span> <Trash size={18} className="text-red-500" /></span>
                  <div onClick={() => setOpen(!open)}>
                    {open ? (
                      <Minus size={22} className="text-primary" />
                    ) : (
                      <Plus size={22} className="text-primary" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Answer */}
              {open && (
                <p className="mt-2 text-purple-400 leading-relaxed transition-all duration-300">
                  {data.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Banners Section */}
      <div className="mb-8 w-[40%]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Banners / Announcements</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Plus /> Add Banner
          </button>
        </div>
        <div className="bg-white shadow rounded-lg">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex justify-between items-center border-b p-3 hover:bg-gray-50"
            >
              <span>{banner.title}</span>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  banner.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {banner.status}
              </span>
              <div className="flex gap-3">
                <button className="text-blue-600">
                  <Edit2Icon />
                </button>
                <button
                  className="text-red-600"
                  onClick={() =>
                    setBanners((prev) => prev.filter((b) => b.id !== banner.id))
                  }
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqAnnoucement
