interface inputprops {
    label: string;
    placeholder: string;
    value?: string;

}
export const FormInput: React.FC<inputprops> = ({label,placeholder}) => {
  return (
    <div className="space-y-2">
        <label htmlFor="" className="text-sm font-normal italic">{label}</label>
        <div className="w-full  py-3 rounded-xl bg-purple-200">
        <input className="px-4 text-lg font-light w-full h-full outline-none" type="text"  placeholder={placeholder}/></div>
    </div>
  )
}
