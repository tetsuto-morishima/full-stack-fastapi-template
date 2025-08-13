import { Button } from "./button";
import { FcGoogle } from "react-icons/fc";

type Props = {
  onClick: () => void;
};
const GoogleLoginButton = ({ onClick }: Props) => (
  <Button variant="outline" leftIcon={<FcGoogle />} onClick={onClick}>
    Googleでログイン
  </Button>
);
export default GoogleLoginButton;