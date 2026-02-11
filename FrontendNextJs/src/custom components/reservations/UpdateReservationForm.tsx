"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
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
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Reservation } from "./tableadmin"
import { useLoading } from "../LoadingContext"

interface DatePickerFormProps {
  reservation: {
    id: string;
    vehicle_id: string;
    customer_id: string;
    payed: boolean;
    start_date: string;
    end_date: string;
  };
  onUpdateSuccess: (updatedReservation: Reservation) => void;
}

const FormSchema = z.object({
  customer_id: z.string(),
  vehicle_id: z.string(),
  start_date: z.date({
    required_error: "A start date is required.",
  }),
  end_date: z.date({
    required_error: "A end date is required.",
  }),
})

export default function DatePickerFormUpdate({ reservation, onUpdateSuccess}: DatePickerFormProps) {
  const { loading, loadingRowId, setGlobalLoading } = useLoading();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customer_id: reservation?.customer_id,
      vehicle_id: reservation?.vehicle_id,
      start_date: new Date(reservation?.start_date),
      end_date: new Date(reservation?.end_date),
    }
  })


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setGlobalLoading(true, reservation.id)
    try {
      const requestData = {
        "customer_id": data.customer_id,
        "payed": false,
        "vehicle_id": data.vehicle_id,
        "start_date": data.start_date,
        "end_date": data.end_date,
      };

      const url = `/api/reservations/${reservation.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        toast({
          title: "Reservation has been updated",
        })
        onUpdateSuccess({ ...reservation, ...requestData, start_date: requestData.start_date.toISOString(), end_date: requestData.end_date.toISOString() });
      }
    } catch (error) {
      console.error("There was a problem", error)
    }
    setGlobalLoading(false, reservation.id)
    form.reset();
  }

  return (
    <Form {...form}>

      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="!text-primary">
              Update Reservation
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Id</FormLabel>
                <FormControl>
                  <Input autoComplete="off"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Id</FormLabel>
                <FormControl>
                  <Input autoComplete="off"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
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
                        date < new Date()
                      }
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
            name="end_date"
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
                        date < new Date()
                      }
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
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="submit">Save Changes</Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
