'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";

const addCarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(),
});

type AddCarFormData = z.infer<typeof addCarSchema>;

const AddCar = () => {
  const { toast } = useToast();
  const form = useForm<AddCarFormData>({
    resolver: zodResolver(addCarSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = form;

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 10);
      setImageFiles(selectedFiles);
      if (e.target.files.length > 10) {
        toast({
          title: "Image Limit Exceeded",
          description: "Only the first 10 images will be uploaded.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    setUploading(true);
    const uploadedUrls: string[] = [];
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const response = await fetch(
          `/api/upload?filename=${encodeURIComponent(file.name)}`,
          {
            method: "POST",
            body: file,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to upload image.");
        }
        const blobResult = await response.json();
        if (!blobResult.url) {
          throw new Error("No URL returned for uploaded image.");
        }
        return blobResult.url as string;
      });
      const results = await Promise.all(uploadPromises);
      uploadedUrls.push(...results);
      return uploadedUrls;
    } catch (error) {
      toast({
        title: "Image Upload Failed",
        description: "Failed to upload one or more images.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: AddCarFormData) => {
    try {
      let images: string[] = [];
      if (imageFiles.length > 0) {
        images = await uploadImages();
        if (images.length !== imageFiles.length) {
          throw new Error("Some images failed to upload.");
        }
      }
      const formattedData = {
        title: data.title,
        description: data.description,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        images,
      };
      const response = await axios.post<ApiResponse>("/api/add-car", formattedData);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        reset();
        setImageFiles([]);
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error adding car",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error adding car",
          description: "Failed to add car.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="mb-8 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Car</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Car Title"
                    {...field}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage>{errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Car Description"
                    {...field}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., sedan, electric"
                    {...field}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage>{errors.tags?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Images Field */}
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </FormControl>
            <FormMessage>{/* Handle image upload errors if any */}</FormMessage>
          </FormItem>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            {(isSubmitting || uploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add Car"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCar;
