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
        <main className="mx-4 sm:mx-8 md:mx-12 lg:mx-24 my-8 md:my-24 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full max-w-7xl">
        {vehicles.map((vehicle) => (
          <Link href={`/${vehicle.id}`} key={vehicle.id}>
            <div className="bg-gray-50 hover:shadow-md hover:shadow-emerald-700 transition-shadow overflow-hidden h-full flex flex-col">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img src={vehicle.images.at(0)} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 md:p-6 lg:p-8 flex-1">
                <h2 className={`font-bold text-lg md:text-xl ${font['custom-font-element']} mb-2 line-clamp-1`}>
                  {vehicle.name}
                </h2>
                <p className="font-bold font-serif text-muted-foreground text-xs md:text-sm line-clamp-2">{vehicle.description}</p>
              </div>
            </div>
        </Link>
      ))}
             </div>
             </main>
          )}
        </main>
  );
}
       