import { ColumnDef } from "@tanstack/react-table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  description: string;
};

export const payments: Payment[] = [
  {
    id: "0x122",
    amount: 29,
    status: "pending",
    description: "Pro Plan - Monthly",
  },
  {
    id: "0x123",
    amount: 34,
    status: "success",
    description: "Pro Plan - Monthly",
  },
  {
    id: "0x125",
    amount: 39,
    status: "failed",
    description: "Pro Plan - Monthly",
  },
  {
    id: "0x122",
    amount: 29,
    status: "pending",
    description: "Pro Plan - Monthly",
  },
  {
    id: "0x123",
    amount: 34,
    status: "success",
    description: "Pro Plan - Monthly",
  },
  {
    id: "0x125",
    amount: 39,
    status: "failed",
    description: "Pro Plan - Monthly",
  },
];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
