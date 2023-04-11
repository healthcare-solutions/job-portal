import { useRouter } from "next/router";
import { setUserData } from "../features/candidate/candidateSlice";
const logout = (dispatch) => {
    dispatch(setUserData({name: "", id: "", email: ""}))
    localStorage.clear()
    useRouter().push("/")
}

export { logout };