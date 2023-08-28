import { FC, memo } from 'react';
import { Button, Pin } from '@ui/basics';
// import styles from './enterPinCode.module.css'

const EnterPinCode: FC<{ form: any; isTeam: boolean }> = ({
  form,
  isTeam,
}) => {
  return (
    <>
      <Pin
        label={`Введите пин код ${isTeam ? 'команды' : 'турнира'}`}
        {...form.getInputProps('pinCode')}
      />
      <Button>Зарегистрироваться</Button>
    </>
  );
};

export default memo(EnterPinCode);
