import { FC, memo } from 'react';
import { Button, Pin } from '@ui/basics';
// import styles from './enterPinCode.module.css'

const EnterPinCode: FC<{ form: any; isTeam: boolean }> = ({
  form,
  isTeam,
}) => {
  return (
    <>
      {`Введите пин код ${isTeam ? 'команды' : 'турнира'}`}
      <Pin {...form.getInputProps('pinCode')} />
      <Button>Зарегистрироваться</Button>
    </>
  );
};

export default memo(EnterPinCode);
