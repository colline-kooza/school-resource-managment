"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export interface Column {
  key: string;
  label: string;
  formatter?: "object-title" | "object-name" | "badge-count" | "multi-badge-count" | "boolean-badge" | "code-title" | "announcement-target";
  formatterConfig?: any;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "image";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface CrudTableProps {
  entityName: string;
  apiEndpoint: string;
  columns: Column[];
  fields: Field[];
  title: string;
  description: string;
  slugSource?: string; // Field to generate slug from
}

const AdminCrudTable: React.FC<CrudTableProps> = ({
  entityName,
  apiEndpoint,
  columns,
  fields,
  title,
  description,
  slugSource
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(apiEndpoint);
      setData(response.data);
    } catch (error) {
      toast.error(`Failed to fetch ${entityName}`);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, entityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (row?: any) => {
    if (row) {
      setEditingId(row.id);
      setFormData(row);
    } else {
      setEditingId(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => {
        const newData = { ...prev, [name]: value };
        // Auto-generate slug if source field changes and we are creating
        if (!editingId && slugSource && name === slugSource) {
            newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }
        return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`${apiEndpoint}/${editingId}`, formData);
        toast.success(`${entityName} updated successfully`);
      } else {
        await api.post(apiEndpoint, formData);
        toast.success(`${entityName} created successfully`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`${apiEndpoint}/${deleteId}`);
      toast.success(`${entityName} deleted`);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const renderCell = (row: any, col: Column) => {
    const val = row[col.key];

    if (col.formatter) {
        switch (col.formatter) {
            case "object-title":
                return <span className="font-bold text-[#1A3A6B]">{val?.title || "-"}</span>;
            case "object-name":
                return <span className="text-slate-400 font-bold">{val?.name || "-"}</span>;
            case "code-title":
                return <span className="font-bold text-[#1A3A6B]">{val?.code} - {val?.title}</span>;
            case "badge-count":
                return (
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                        {col.formatterConfig?.prefix || "Items"}: {val?.[col.formatterConfig?.field] || 0}
                    </span>
                );
            case "multi-badge-count":
                return (
                    <div className="flex gap-2">
                        {col.formatterConfig?.map((cfg: any, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                                {cfg.label}: {val?.[cfg.field] || 0}
                            </span>
                        ))}
                    </div>
                );
            case "boolean-badge":
                return (
                    <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        val ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                    )}>
                        {val ? "Active" : "Inactive"}
                    </span>
                );
            case "announcement-target":
                return (
                    <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        val ? "bg-amber-50 text-amber-600" : "bg-[#1A3A6B]/5 text-[#1A3A6B]"
                    )}>
                        {val?.title || "Platform-wide"}
                    </span>
                );
            default:
                return String(val || "-");
        }
    }

    if (col.render) {
        return col.render(val, row);
    }

    return String(val || "-");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A3A6B]">{title}</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">{description}</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-[#1A3A6B]/20 font-bold transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add {entityName}
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <Input 
            placeholder={`Search ${entityName.toLowerCase()}s...`} 
            className="pl-10 rounded-xl border-slate-100 bg-slate-50/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-none">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-[10px] font-bold uppercase text-slate-400 px-8 py-5">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 px-8 py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  {columns.map(c => <TableCell key={c.key} className="px-8 py-5"><div className="h-4 w-24 bg-slate-50 rounded animate-pulse" /></TableCell>)}
                  <TableCell className="px-8 py-5 text-right"><div className="h-8 w-8 bg-slate-50 rounded-lg ml-auto animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-20 text-center">
                    <p className="text-sm font-bold text-slate-400">No {entityName.toLowerCase()}s found.</p>
                  </TableCell>
                </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-8 py-5 text-xs font-medium text-slate-600">
                      {renderCell(row, col)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right px-8 py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-2xl border-slate-100 shadow-xl p-2 font-Inter">
                        <DropdownMenuItem 
                          onClick={() => handleOpenModal(row)}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-[#1A3A6B] flex items-center justify-between"
                        >
                          Edit <Edit2 className="w-3.5 h-3.5" />
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(row.id)}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-rose-600 flex items-center justify-between"
                        >
                          Delete <Trash2 className="w-3.5 h-3.5" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl border-none p-0 max-h-[90vh] overflow-y-auto font-Inter">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold text-[#1A3A6B]">
                {editingId ? "Edit" : "Add New"} {entityName}
              </DialogTitle>
            </DialogHeader>
            <div className="p-8 space-y-6">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    {field.label} {field.required && "*"}
                  </Label>
                  
                  {field.type === "textarea" ? (
                    <Textarea 
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="rounded-xl border-slate-200 focus:ring-[#1A3A6B]"
                    />
                  ) : field.type === "select" ? (
                    <Select 
                      value={formData[field.name] || ""} 
                      onValueChange={(val) => handleInputChange(field.name, val)}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 bg-white h-12">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="rounded-xl border-slate-200 h-12 focus:ring-[#1A3A6B]"
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold h-12">Cancel</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-xl font-bold h-12 px-8 min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? "Save Changes" : `Create ${entityName}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title={`Delete ${entityName}?`}
        description={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone and may affect related data.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
};

export default AdminCrudTable;
