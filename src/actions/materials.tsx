"use server";

import { API } from "utils/constants";

interface IncomingMaterial {
  ShippingID: string;
  CustomerName: string;
  CustomerID: number;
  StockID: string;
  Cost: number;
  Quantity: number;
  MinQty: number;
  MaxQty: number;
  Description: string;
  IsActive: boolean;
  MaterialType: string;
  Owner: string;
}

export async function fetchMaterialTypes() {
  try {
    const res = await fetch(`${API}/material_types`);
    if (!res) return [];

    const data = await res.json();
    if (!data?.length) return [];

    const types = data
      .map((type: any, i: number) => ({
        id: i,
        name: type,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return types;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function sendMaterial(formData: FormData | null) {
  if (!formData) return { error: "Error: No Form Data" };

  const material = {
    customerId: formData.get("customerId"),
    stockId: formData.get("stockId"),
    type: formData.get("materialType"),
    quantity: formData.get("qty"),
    cost: formData.get("cost"),
    minQuantity: formData.get("minQty"),
    maxQuantity: formData.get("maxQty"),
    description: formData.get("description"),
    owner: formData.get("owner") == "on" ? "Tag" : "Customer",
    isActive: formData.get("isActive") == "on",
  };

  try {
    const res = await fetch(`${API}/incoming_materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

    if (res.status != 200) {
      return { message: res.statusText };
    }

    return { message: `Material "${material.stockId}" sent to the Warehouse` };
  } catch (error: any) {
    return { error: "Error: " + error.message };
  }
}

export async function fetchIncomingMaterials(materialId = "") {
  try {
    const res = await fetch(
      `${API}/incoming_materials${
        materialId ? "?materialId=" + materialId : ""
      }`
    );
    if (!res) return [];

    const data = await res.json();
    if (!data?.length) return [];

    const materials = data.map((material: IncomingMaterial) => ({
      shippingId: material.ShippingID,
      customerName: material.CustomerName,
      customerId: material.CustomerID,
      stockId: material.StockID,
      cost: material.Cost,
      quantity: material.Quantity,
      minQty: material.MinQty,
      maxQty: material.MaxQty,
      description: material.Description,
      isActive: material.IsActive,
      materialType: material.MaterialType,
      owner: material.Owner,
    }));
    return materials;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createMaterial(
  incomingMaterialId: string,
  formData: FormData | null
) {
  if (!formData) return { error: "Error: No Form Data" };

  const incomingMaterial = {
    materialId: incomingMaterialId,
    quantity: formData.get("quantity"),
    locationId: formData.get("locationId"),
    notes: formData.get("notes"),
    serialNumberRange: formData.get("serialNumberRange"),
  };

  try {
    const res = await fetch(`${API}/materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incomingMaterial),
    });
    const data = await res.json();

    if (res.status != 200) {
      return { error: "Error: " + data.message };
    }
    return null;
  } catch (error: any) {
    return { error: "Error: " + error.message };
  }
}

export async function updateMaterial(material: any) {
  await fetch(`${API}/materials`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(material),
  });
}

export async function moveMaterial(
  materialId: string,
  formData: FormData | null
) {
  if (!formData) return { error: "Error: No Form Data" };

  const material = {
    materialId,
    quantity: formData.get("quantity"),
    locationId: formData.get("locationId"),
  };

  try {
    const res = await fetch(`${API}/materials/move-to-location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });
    const data = await res.json();

    if (res.status != 200) {
      return { error: "Error: " + data.message };
    }
    return null;
  } catch (error: any) {
    return { error: "Error: " + error.message };
  }
}

export async function removeMaterial(
  materialId: string,
  formData: FormData | null
) {
  if (!formData) return { error: "Error: No Form Data" };

  const material = {
    materialId,
    quantity: formData.get("quantity"),
    jobTicket: formData.get("jobTicket"),
    serialNumberRange: formData.get("serialNumberRange"),
  };

  try {
    const res = await fetch(`${API}/materials/remove-from-location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });
    const data = await res.json();

    if (res.status != 200) {
      return { error: "Error: " + data.message };
    }
    return null;
  } catch (error: any) {
    return { error: "Error: " + error.message };
  }
}

export async function fetchMaterials(filterOpts: any) {
  const {
    materialId = "",
    stockId = "",
    customerName = "",
    description = "",
    locationName = "",
    userRole = "",
  } = filterOpts;

  const queryParams = new URLSearchParams({
    materialId,
    stockId,
    customerName,
    description,
    locationName,
  });

  try {
    const res = await fetch(`${API}/materials?${queryParams.toString()}`);
    if (!res) return [];

    const data = await res.json();
    if (!data?.length) return [];

    let materials = data.map((material: any) => ({
      materialId: material.MaterialID,
      warehouseName: material.WarehouseName,
      stockId: material.StockID,
      customerId: material.CustomerID,
      customerName: material.CustomerName,
      locationId: material.LocationID,
      locationName: material.LocationName,
      materialType: material.MaterialType,
      description: material.Description,
      notes: material.Notes,
      quantity: material.Quantity,
      updatedAt: material.UpdatedAt,
      isActive: material.IsActive,
      cost: material.Cost,
      minQty: material.MinQty,
      maxQty: material.MaxQty,
      owner: material.Owner,
      isPrimary: material.IsPrimary,
      serialNumberRange: material.SerialNumberRange,
    }));

    // Do include 0 qty only for the CSR and Admin Role
    if (!["csr", "admin"].includes(userRole)) {
      materials = materials.filter((m: any) => m.quantity);
      return materials;
    }

    return materials;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function uploadMaterials(jsonData: any) {
  const res: any = await fetch(`${API}/import_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  });
  const dataResult = await res.json();
  return dataResult;
}

export async function fetchRequestedMaterials() {
  try {
    const res = await fetch(`${API}/requested_materials`);
    if (!res) return [];

    const data = await res.json();
    if (!data?.data?.length) return [];

    const materials = data.data.map((material: any) => ({
      requestId: material.RequestID,
      stockId: material.StockID,
      description: material.Description,
      quantity: material.Quantity,
      username: material.UserName,
    }));

    return materials;
  } catch (error) {
    console.error(error);
    return [];
  }
}
