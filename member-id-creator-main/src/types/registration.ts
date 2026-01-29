export interface RegistrationData {
  // Step 1 - Personal Data
  fullName: string;
  gender: 'Masculino' | 'Feminino' | '';
  birthDate: string;
  
  // Step 2 - Parents
  motherName: string;
  fatherName: string;
  
  // Step 3 - Contacts
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  
  // Step 4 - Address
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 5 - Password
  password: string;
  confirmPassword: string;
  
  //step 6 - Religious Information
  baptismDate?: string;
ministries?: string[]; // array de IDs


    // Step 7 - Selfie
  selfie_url?: string;

}

export const initialRegistrationData: RegistrationData = {
  fullName: '',
  gender: '',
  birthDate: '',
  motherName: '',
  fatherName: '',
  primaryPhone: '',
  secondaryPhone: '',
  email: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  password: '',
  confirmPassword: '',
  selfie_url: undefined,
  ministries: [],
  baptismDate:''
};

