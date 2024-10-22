import { useRecoilValue } from "recoil"
import LoginCard from "../components/Login"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/AuthAtom"

const AuthPage = () => {
  const authSreenState = useRecoilValue(authScreenAtom);
  console.log(authSreenState);
  return (
    <div>
        
    <LoginCard />
    </div>
  )
}

export default AuthPage