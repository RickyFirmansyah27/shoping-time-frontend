import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPost, apiGet, apiPut, apiDelete } from "./axios-client";
import { AddProduct, EditProduct } from "@/services/types";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/api/v1/product";

export const useAddProduct = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (body: AddProduct) => apiPost(`${basePath}/add`, body),
  });
};

export const useGetAllProducts = (query = {}) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get all product", query],
    queryFn: async () => {
      return await apiGet(`${basePath}`, query);
    },
  });
};

export const useEditProduct = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: ({ id, body }: { id: string; body: EditProduct }) =>
      apiPut(`${basePath}/${id}`, body),
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (id: string) => apiDelete(`${basePath}/${id}`),
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get product by id", id],
    queryFn: async () => {
      return await apiGet(`${basePath}/${id}`);
    },
  });
};