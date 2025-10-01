import Link from "next/link";
import  Menu  from "../custom components/Menu";
import Loading from "../custom components/loading"
import { useEffect, useState } from "react";
import font from'../custom components/font.module.css'

const getData = async() =>{
    try {
        const url = '/api/vehicles';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        await new Promise((resolve) => setTimeout(resolve, 150))
        const data = await response.json();
        return data
    }catch(error){
        console.error('there was a problem', error)
        return []
    }
}
export default function vehicles(){
    const [isLoading, setIsLoading] = useState(true);
    const [vehicles, setVehicles] 
    = useState<Array<{ id: string; images: any[]; name: string; description: string }>>([]);
  
    useEffect(() => {
      // Fetch data when the component mounts
      getData()
        .then((responseData) => {
          setVehicles(responseData || []); // Store the fetched vehicles in state
          setIsLoading(false); // Set isLoading to false when data is fetched
        })
        .catch((error) => {
          // Handle errors if the fetch fails
          setVehicles([]);
          setIsLoading(false); // Set isLoading to false on error
        });
    }, []);
  
    return (
        <main className="">
          <nav className="p-6 space-x-6 ">
            <Menu/>
          </nav>
          {isLoading ? (
        <Loading />
      ) : (
        <main className="m-24 flex justify-center">
        <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 custom-xs:grid-cols-1 gap-12">
        {vehicles.map((vehicle) => (
          <Link href={`/${vehicle.id}`} key={vehicle.id}>
            <div className="p-8 bg-gray-50 hover:shadow-md hover:shadow-emerald-700">
              <div>
                <img src={vehicle.images.at(0)} alt={vehicle.name} className="rounded-mb w-96 h-80 object-cover " />
              </div>
              <h2 className={`h-5 w-1/2 font-bold text-xl ${font['custom-font-element']} mb-2`}>
              {vehicle.name}
              </h2>              
            <p className="h-4 w-1/2 font-bold font-serif text-muted-foreground text-xs mb-4">{vehicle.description}</p>
            </div>
        </Link>
      ))}
             </div>
             </main>
          )}
        </main>
  );
}
       