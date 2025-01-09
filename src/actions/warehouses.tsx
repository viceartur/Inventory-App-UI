"use server";

import { API } from "utils/constants";

export async function createWarehouse(prevState: any, formData: FormData) {
  const warehouse = {
    warehouseName: formData.get("warehouseName"),
    locationName: formData.get("locationName"),
  };

  try {
    const res = await fetch(`${API}/warehouses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(warehouse),
    });

    if (res.status != 200) {
      return { message: "Error: " + res.statusText };
    }
    return {
      message: `Location "${warehouse.locationName}" attached to the Warehouse "${warehouse.warehouseName}"`,
    };
  } catch (error: any) {
    return { message: "Error: " + error.message };
  }
}

export async function fetchWarehouses() {
  try {
    const res = await fetch(`${API}/warehouses`);
    if (!res) return [];
    const data = await res.json();
    if (!data?.length) return [];
    const warehouses = data.map((warehouse: any) => ({
      warehouseId: warehouse.WarehouseID,
      warehouseName: warehouse.WarehouseName,
    }));
    return warehouses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchLocations() {
  try {
    const res = await fetch(`${API}/locations`);
    if (!res) return [];
    const data = await res.json();
    if (!data?.length) return [];

    const locations = data.map((location: any) => ({
      id: location.ID,
      locationName: location.Name,
      warehouseName: location.WarehouseName,
    }));
    return locations;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchAvailableLocations(stockId: string, owner: string) {
  try {
    const res = await fetch(
      API + `/available_locations?stockId=${stockId}&owner=${owner}`
    );
    if (!res) return [];
    const data = await res.json();
    if (!data?.length) return [];

    const locations = data.map((location: any) => ({
      id: location.ID,
      name: location.Name,
    }));
    return locations;
  } catch (error) {
    console.error(error);
    return [];
  }
}
