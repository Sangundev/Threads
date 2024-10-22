import { atom } from 'recoil'; // Added destructuring to follow best practices

const authScreenAtom = atom({
  key: 'authScreenAtom',  // Unique ID for the atom
  default: 'login',       // Default state is 'login'
});

export default authScreenAtom;
