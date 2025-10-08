export interface Booking {
  id: string;       
  date: string;        
  roomId: string;           
  userId: string;           
  startTime: string;        
  endTime: string;          
  title: string;
  description?: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
  createdAt: string;        
  updatedAt: string;       
}