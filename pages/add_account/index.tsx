import { LoginLayout } from "@layouts/LoginLayout";
import { ReactElement } from "react";



function AddAccount() {
  return (
    <>Add account</>
  )
}

AddAccount.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default AddAccount;