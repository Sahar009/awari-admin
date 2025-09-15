import houseimg from '../assets/images/houseimg (10).jpg'

export const ReviewModal = ({ property, onClose, onApprove, onDeny }: any) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Review Property Listing</h2>

        <div className="space-y-3">
          <div className='grid grid-cols-5 grid-rows-2 gap-4 rounded-3xl overflow-hidden w-full h-64'>
           <div className='w-full h-full col-span-2 row-span-2'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>

          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          <div className='w-full h-full'>
            <img src={houseimg} alt="" className='w-full h-full'/>
          </div>
          </div>
         
          <h3 className="text-lg font-semibold">{property.propertyTitle}</h3>
          <p className="text-gray-600">
            <span className="font-medium">Vendor:</span> {property.vendor}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Type:</span> {property.PropertyType}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {property.location}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> {property.price}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {property.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt="Property"
              className="rounded-lg border h-28 object-cover"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeny(property.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Deny
          </button>
          <button
            onClick={() => {
              onApprove(property.id);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};