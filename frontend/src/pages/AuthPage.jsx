import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/AuthAtom"

const AuthPage = () => {
  const authSreenState = useRecoilValue(authScreenAtom);
  console.log(authSreenState);
  return (
    <div>
        
    {authSreenState === "login" ? <LoginCard /> : <SignupCard />  }
    </div>
  )
}

export default AuthPage