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
    <main className="m-24 flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 custom-xs:grid-cols-1 gap-6">
      {vehicleData ? 
      <>
        <div className="p-8 bg-gray-50 hover:shadow-md hover:shadow-emerald-700">
          <div>
            <img
              src={vehicleData.images.at(0)}
              alt={vehicleData.name}
              className="rounded-mb w-96 h-80 object-cover"
            />
          </div>
          <h2 className="h-5 w-1/2 font-bold mb-2">{vehicleData.name}</h2>
          <p className="h-4 w-1/2 font-bold text-sm mb-2">${vehicleData.retail_price?.toLocaleString()}</p>
          <p className="h-4 w-1/2 font-bold text-sm mb-2">Make: {vehicleData.make}</p>
          <p className="h-4 w-1/2 font-bold text-sm">{vehicleData.mileage?.toLocaleString()} miles</p>
        </div>
         <div className="self-center px-10">
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
