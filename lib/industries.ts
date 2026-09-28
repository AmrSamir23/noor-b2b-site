import { Building2, Droplets, Factory, GraduationCap, Home, Hospital, ShoppingBag, Warehouse, type LucideIcon } from "lucide-react";

export const sectorIcons: Record<string, LucideIcon> = {
  factories: Factory,
  hospitals: Hospital,
  education: GraduationCap,
  malls: ShoppingBag,
  residential: Home,
  offices: Building2,
  utilities: Droplets,
  industrial: Warehouse,
};
