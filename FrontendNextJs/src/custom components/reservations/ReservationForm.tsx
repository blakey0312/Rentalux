"use client"

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Icons } from "@/constants";
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

interface DatePickerFormProps {
    vehicleId: string; 
    reservations: Array<{
        startData: string;
        endData: string;
      }>;
  }

const FormSchema = z.object({
  startData: z.date({
    required_error: "A start date is required.",
  }),
  endData: z.date({
    required_error: "A end date is required.",
  }),
})


export default function DatePickerForm({ vehicleId, reservations }: DatePickerFormProps) {
  const {user } = useUser();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function isDateRangeOverlapping(date : Date, ranges : any) {
    for (const range of ranges) {
      if (date >= range.start && date <= range.end) {
        return true;
      }
    }
    return false;
  }
  
  //Will be able to add dates just created to disabled without actually making another request
  // Check if reservations is defined, otherwise set an empty array
  const initialDisabledDateRanges = reservations
    ? reservations.map((reservation) => ({
        start: new Date(reservation.startData),
        end: new Date(reservation.endData),
      }))
    : [];

  const [disabledDateRanges, setDisabledDateRanges] = useState(initialDisabledDateRanges);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
      setLoading(true);
      try{
      
          const requestData = {
            start_date: data.startData,
            end_date: data.endData,
            vehicle_id: vehicleId,
            customer_id: user!.id,
            payed: false
          };
      
        const url = '/api/reservations'; 

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else{
          const newReservation = {
            start: new Date(data.startData),
            end: new Date(data.endData),
          };
          setDisabledDateRanges([...disabledDateRanges, newReservation]);
          setLoading(false);
            toast({
            title: "Dates have been reserved",
          })
        }
     }catch(error){
        console.error("There was a problem", error)
     }
     
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startData"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                        date < new Date() || isDateRangeOverlapping(date, disabledDateRanges)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
               Start day to reserve from
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endData"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                        date < new Date() || isDateRangeOverlapping(date, disabledDateRanges)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                End day to reserve to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="">
          {loading ? (<Icons.spinner className="h-4 w-12 animate-spin" />)
           : ("Reserve")
          }
          </Button>
      </form>
    </Form>
  )
}
