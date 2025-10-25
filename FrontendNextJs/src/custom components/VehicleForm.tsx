"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { API_ENDPOINTS } from "@/lib/api-config"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  retailPrice:  z.string(),
  mileage:  z.string(),
  vehicleType: z.string(),
  make: z.string(),
  images: z.string(),

})

export default function VehicleForm() {
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      retailPrice: "",
      mileage: "",
      vehicleType: "",
      make: "",
      images: ""
    },
  })

  
 async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      const imagesArray = values.images.split(',').map((url) => url.trim());

      // Clean numeric values (remove commas and convert to numbers)
      const cleanedRetailPrice = parseFloat(values.retailPrice.replace(/,/g, ''));
      const cleanedMileage = parseFloat(values.mileage.replace(/,/g, ''));

      // Transform camelCase to snake_case for API
      const payload = {
        name: values.name,
        description: values.description,
        retail_price: cleanedRetailPrice,
        mileage: cleanedMileage,
        vehicle_type: values.vehicleType,
        make: values.make,
        images: imagesArray
      };

      const response = await fetch(API_ENDPOINTS.vehicles.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        toast({
          title: "Rental has been created",
          description: values.name
        })
      }

      form.reset()
    } catch (error) {
      console.error('There was a problem', error);
    }
  }
  
  return (<Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[300px]">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Porsche" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
            <Input placeholder="Fasttt" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="retailPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rental Price</FormLabel>
            <FormControl>
            <Input  placeholder="1300" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mileage</FormLabel>
            <FormControl>
            <Input placeholder="450" autoComplete="off"{...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicleType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Vehicle Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="SUV">Suv</SelectItem>
                <SelectItem value="COUPE">Coupe</SelectItem>
                <SelectItem value="SEDAN">Sedan</SelectItem>
                <SelectItem value="PICKUP">Pickup</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make</FormLabel>
            <FormControl>
            <Input placeholder="2018" autoComplete="off"{...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
            <Input type="textarea" placeholder="https://google.com, https://google2.com " autoComplete="off"{...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="px-3 h-9 ">Create</Button>
    </form>
  </Form>)
}
