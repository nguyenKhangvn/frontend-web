import Button from "@mui/material/Button";
import { Avatar as AvatarMUI } from "@mui/material";
import { useSelector } from "react-redux";
function Avatar() {
  const user = useSelector((state: any) => state.account.user);
  return (
    <>
      <Button startIcon={<AvatarMUI>HI!!</AvatarMUI>}>
          Xin chào {user?.name || "Khách"}
      </Button>
    </>
  );
  }
export default Avatar;