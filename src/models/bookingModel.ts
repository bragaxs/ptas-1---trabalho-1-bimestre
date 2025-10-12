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
       
}

export interface createdAt {
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  status?: 'Confirmed' | 'Cancelled' | 'Pending';
}

export interface updatedAt {
  roomId?: string;
  userId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  description?: string;
  status?: 'Confirmed' | 'Cancelled' | 'Pending';
}