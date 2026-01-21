// --------------------------------------------------
// Definição do produto que serzá vendido no seu SaaS
// --------------------------------------------------
export interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
  googleDriveFileId: string;
}

// --------------------------------------------------
// Definição da transição
// --------------------------------------------------
export interface Transaction {
  id: string;
  productId: string;
  customerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}
