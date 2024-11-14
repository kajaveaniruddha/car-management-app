// components/CarList.tsx

'use client';

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ICars } from "@/models/Car";
import Image from "next/image";

const CarList = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<ICars[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/list-cars");
      if (response.data.success) {
        setCars(response.data.cars || []);
        // Initialize image indices for each car
        const initialIndices: Record<string, number> = {};
        response.data.cars.forEach((car) => {
          initialIndices[car._id as string] = 0;
        });
        setCurrentImageIndices(initialIndices);
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching cars",
        description:
          axiosError.response?.data.message || "Failed to load cars.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);


  const handlePrevImage = (carId: string) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [carId]: prev[carId] > 0 ? prev[carId] - 1 : 0,
    }));
  };

  const handleNextImage = (carId: string, totalImages: number) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [carId]: prev[carId] < totalImages - 1 ? prev[carId] + 1 : prev[carId],
    }));
  };

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-car/${carId}`);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        // Remove the car from state
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error deleting car",
        description:
          axiosError.response?.data.message || "Failed to delete car.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Cars</h2>
        <button
          onClick={fetchCars}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      {cars.length === 0 ? (
        <p className="text-gray-600">You have no cars listed.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const carId = car._id as string;
            const currentIndex = currentImageIndices[carId] || 0;
            const totalImages = car.images ? car.images.length : 0;
            return (
              <Card key={carId}>
                <div className="relative">
                  <Image
                    width={100}
                    height={100}
                    src={car.images && totalImages ? car.images[currentIndex] : "/temp.jpg"}
                    alt={car.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {car.images && totalImages > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(carId)}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                      >
                        &#10094;
                      </button>
                      <button
                        onClick={() => handleNextImage(carId, totalImages)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                      >
                        &#10095;
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {totalImages > 0 ? currentIndex + 1 : 0} / {totalImages}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle>{car.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{car.description}</p>
                  <div className="mt-2">
                    {car.tags.map((tag, index) => (
                      <span
                        key={tag + index}
                        className="inline-block bg-gray-200 text-gray-800 px-2 py-1 mr-2 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(carId)}
                    className="mt-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CarList;
