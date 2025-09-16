import { SearchIcon } from "lucide-react"


const SearchInput = () => {
  return (
    <div className="">
    <div className="border-none py-2 px-2 rounded-lg flex flex-row items-center gap-2 bg-purple-100">
        <SearchIcon size={15} className="text-slate-400"/>
        <input type="text" placeholder="Search" className="outline-none placeholder:text-slate-400 font-light text-slate-500"/></div> 
    </div>
  )
}

export default SearchInput