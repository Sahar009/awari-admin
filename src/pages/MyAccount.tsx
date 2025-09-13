import profileImg from "../assets/images/houseimg (7).jpg";
import { FormInput } from "../components/ui/FormInput";

const MyAccount = () => {
  return (
    <div className="h-full w-full space-y-12 bg-white rounded-xl shadow-xl p-12">
      <div className="flex flex-row items-center gap-5">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-32 h-32 border border-primary border-dashed rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover "
              src={profileImg}
              alt="profile image"
            />
          </div>
          <p className="text-lg font-light">Admin harvertz</p>
        </div>
        <div className="space-x-3">
          <button className="px-4 py-2 border border-primary rounded-lg text-primary">
            Upload
          </button>
          <button className="px-4 py-2 border border-red-500 rounded-lg text-red-500">
            Remove
          </button>
        </div>
      </div>

       <div className="w-[80%]">
        <div className="grid grid-cols-2 gap-8 w-full">
        <FormInput label="User Name" placeholder="Declan Rice" />
        <FormInput label="Email Address" placeholder="sahar@gmail.com" />
        <FormInput label="First Name" placeholder="Bukayo" />
        <FormInput label="Last Name" placeholder="Zubimendi" />
        <FormInput label="password" placeholder="*********" />
      </div>
       </div>
      
    </div>
  );
};

export default MyAccount;
