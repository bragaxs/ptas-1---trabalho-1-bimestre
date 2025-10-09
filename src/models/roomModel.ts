export interface Room {
  id: string;         
  name: string;             
  capacity: number;         
  location?: string;        
  features: string[];       
  isActive: boolean;       

}

export interface createdAt {
  name: string;
  capacity: number;
  location?: string;
  features?: string[];
}

export interface updatedAt {
  name: string;
  capacity: number;
  location?: string;
  features?: string[];
}