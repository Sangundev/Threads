import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-threads")), // Thêm giá trị mặc định là `null`
});

export default userAtom;
