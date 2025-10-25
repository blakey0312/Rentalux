import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import  Menu  from "../custom components/Menu";
import  DatePickerForm  from "../custom components/reservations/ReservationForm";
import LoadingSingle from "../custom components/loadingsingle";

const getData = async (id: string | string[]) => {
  try {
    const url = `/api/vehicles/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('there was a problem', error);
    return null;
  }
}

export default function Vehicle() {
  const router = useRouter();
  const { id } = router.query;
  const [vehicleData, setVehicleData]
  = useState<{ images: any[]; name: string; retail_price: number; make: string; mileage: number; description: string; id: string; reservations: any[] } | null>(null);

  useEffect(() => {
    if (id) {
      getData(id).then((data) => {
        setVehicleData(data);
      });
    }
  }, [id]);

  return (
    <main className="">
          <nav className="p-6 space-x-6 ">
            <Menu/>
          </nav>
    <main className="mx-4 sm:mx-8 md:mx-12 lg:mx-24 my-8 md:my-24 flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 w-full max-w-6xl">
      {vehicleData ?
      <>
        <div className="bg-gray-50 hover:shadow-md hover:shadow-emerald-700 transition-shadow overflow-hidden">
          <div className="w-full aspect-[4/3] overflow-hidden">
            <img
              src={vehicleData.images.at(0)}
              alt={vehicleData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            <h2 className="font-bold text-xl md:text-2xl mb-3">{vehicleData.name}</h2>
            <p className="font-bold text-base md:text-lg mb-2">
              {Number(vehicleData.retail_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
            <p className="font-bold text-sm md:text-base mb-2">Make: {vehicleData.make}</p>
            <p className="font-bold text-sm md:text-base">{Number(vehicleData.mileage).toLocaleString()} miles</p>
          </div>
        </div>
         <div className="flex items-center justify-center p-4 md:p-6 lg:p-8">
         <DatePickerForm vehicleId = {vehicleData.id} reservations={vehicleData.reservations}/>
        </div>
        </>
       : (
        <LoadingSingle/>
      )}
      </div>
    </main>
    </main>
  );
}
