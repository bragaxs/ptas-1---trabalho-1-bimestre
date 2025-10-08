export interface User {
  id: string;           
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;   
  role: 'Admin' | 'Standard';  //standard = padrao
  registration: string;  //para fazer a verificação de email único
  isActive: boolean; //para saber se o usuário está ativo ou inativo
}

export interface createdAt {
  name: string;
  email: string;
  registration: string; //para fazer a verificação de email único 
  isActive: boolean; //para saber se o usuário está ativo ou inativo
}

export interface updatedAt {
  name?: string;
  email?: string;
  registration?: string; //para fazer a verificação de email único
  isActive?: boolean; //para saber se o usuário está ativo ou inativo
  dados ?: User; //para atualizar os dados do usuário
  
}