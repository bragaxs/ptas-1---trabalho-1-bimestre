export interface Room {
  id: string;         
  name: string;             
  capacity: number;         
  location?: string;        
  features: string[];       
  isActive: boolean;       
}